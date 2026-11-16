"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { emailSchema, signInSchema, signUpSchema, toE164PK } from "@bizniss/shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
}

const GENERIC_SEND_ERROR = "We couldn't send a code right now. Please try again in a minute.";

function formValues(formData: FormData, keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? "")]));
}

function verifyUrl(email: string) {
  return `/verify?email=${encodeURIComponent(email)}`;
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = formValues(formData, ["name", "email", "phone", "role"]);
  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const { name, email, phone, role } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, data: { name, phone: toE164PK(phone), role } },
  });
  if (error) return { error: GENERIC_SEND_ERROR, values };

  redirect(verifyUrl(email));
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = formValues(formData, ["email"]);
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: false },
  });
  // Same response whether or not the account exists, so emails can't be enumerated.
  if (error && error.status !== 422 && error.status !== 400) {
    return { error: GENERIC_SEND_ERROR, values };
  }

  redirect(verifyUrl(parsed.data.email));
}

const verifySchema = z.object({
  email: emailSchema,
  token: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
});

export async function verifyCode(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = formValues(formData, ["email", "token"]);
  const parsed = verifySchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "email",
  });
  if (error) return { error: "That code is invalid or has expired. Request a new one.", values };

  redirect("/account");
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
