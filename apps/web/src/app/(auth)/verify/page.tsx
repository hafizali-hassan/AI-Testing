import type { Metadata } from "next";
import { Suspense } from "react";
import { emailSchema } from "@bizniss/shared";
import { AuthCard } from "@/components/ui";
import { VerifyForm } from "../forms";

export const metadata: Metadata = { title: "Enter code" };

async function VerifyContent({ searchParams }: { searchParams: PageProps<"/verify">["searchParams"] }) {
  const { email } = await searchParams;
  const parsed = emailSchema.safeParse(typeof email === "string" ? email : "");
  if (!parsed.success) {
    return (
      <p className="text-sm text-muted">
        This link is missing an email.{" "}
        <a href="/signin" className="font-semibold text-brand-600">
          Start again
        </a>
      </p>
    );
  }
  return (
    <>
      <p className="mb-4 text-sm text-muted">
        We sent a code to <strong className="text-ink">{parsed.data}</strong>. It expires soon.
      </p>
      <VerifyForm email={parsed.data} />
    </>
  );
}

export default function VerifyPage(props: PageProps<"/verify">) {
  return (
    <AuthCard title="Check your email">
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <VerifyContent searchParams={props.searchParams} />
      </Suspense>
      <p className="mt-6 text-center text-sm text-muted">
        Didn&apos;t get it?{" "}
        <a href="/signin" className="font-semibold text-brand-600">
          Send a new code
        </a>
      </p>
    </AuthCard>
  );
}
