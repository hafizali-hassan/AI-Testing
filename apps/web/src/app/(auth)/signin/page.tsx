import type { Metadata } from "next";
import { AuthCard } from "@/components/ui";
import { SignInForm } from "../forms";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Enter your email and we'll send you a sign-in code.">
      <SignInForm />
      <p className="mt-6 text-center text-sm text-muted">
        New to Bizniss?{" "}
        <a href="/signup" className="font-semibold text-brand-600">
          Create an account
        </a>
      </p>
    </AuthCard>
  );
}
