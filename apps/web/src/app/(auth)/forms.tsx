"use client";

import { useActionState } from "react";
import { Field, FormAlert, PrimaryButton } from "@/components/ui";
import { signIn, signUp, verifyCode, type AuthFormState } from "./actions";

const initial: AuthFormState = {};

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, initial);
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormAlert>{state.error}</FormAlert>
      <Field label="Full name" name="name" autoComplete="name" required defaultValue={v.name} errors={e.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={v.email} errors={e.email} />
      <Field
        label="Mobile number"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="03001234567"
        required
        defaultValue={v.phone}
        errors={e.phone}
      />
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">I want to</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            ["customer", "Book services"],
            ["business", "List a business"],
            ["technician", "Work as technician"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-brand border border-border px-3 text-sm has-checked:border-brand-500 has-checked:bg-brand-50"
            >
              <input type="radio" name="role" value={value} defaultChecked={(v.role || "customer") === value} className="accent-brand-500" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Sending code…" : "Create account"}
      </PrimaryButton>
    </form>
  );
}

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, initial);
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormAlert>{state.error}</FormAlert>
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        errors={state.fieldErrors?.email}
      />
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Sending code…" : "Email me a sign-in code"}
      </PrimaryButton>
    </form>
  );
}

export function VerifyForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(verifyCode, initial);
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormAlert>{state.error}</FormAlert>
      <input type="hidden" name="email" value={email} />
      <Field
        label="6-digit code"
        name="token"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        required
        errors={state.fieldErrors?.token ?? state.fieldErrors?.email}
      />
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Checking…" : "Verify and continue"}
      </PrimaryButton>
    </form>
  );
}
