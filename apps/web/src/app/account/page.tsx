import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthCard, PrimaryButton } from "@/components/ui";
import { signOut } from "../(auth)/actions";

export const metadata: Metadata = { title: "My account" };

async function AccountDetails() {
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, role")
    .eq("id", userId)
    .single();

  const rows: [string, string | null | undefined][] = [
    ["Name", profile?.full_name],
    ["Email", profile?.email],
    ["Mobile", profile?.phone],
    ["Account type", profile?.role],
  ];

  return (
    <dl className="divide-y divide-border rounded-brand border border-border">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
          <dt className="text-muted">{k}</dt>
          <dd className="font-medium capitalize">{v ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function AccountPage() {
  return (
    <AuthCard title="My account">
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <AccountDetails />
      </Suspense>
      <form action={signOut} className="mt-6 flex flex-col">
        <PrimaryButton type="submit">Sign out</PrimaryButton>
      </form>
    </AuthCard>
  );
}
