import type { Metadata } from "next";
import { AuthCard } from "@/components/ui";
import { SignUpForm } from "../forms";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <AuthCard title="Create your account" subtitle="We'll email you a 6-digit code. No password needed.">
      <SignUpForm />
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <a href="/signin" className="font-semibold text-brand-600">
          Sign in
        </a>
      </p>
    </AuthCard>
  );
}
