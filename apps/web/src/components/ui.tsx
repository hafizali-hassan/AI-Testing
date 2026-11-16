import type { ComponentProps, ReactNode } from "react";

export function Field({
  label,
  name,
  errors,
  hint,
  ...input
}: { label: string; name: string; errors?: string[]; hint?: string } & ComponentProps<"input">) {
  const errorId = `${name}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={errors?.length ? errorId : undefined}
        className="min-h-12 rounded-brand border border-border bg-surface px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 aria-invalid:border-red-500"
        {...input}
      />
      {hint && !errors?.length && <p className="text-xs text-muted">{hint}</p>}
      {errors?.length ? (
        <p id={errorId} className="text-sm text-red-600">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}

export function PrimaryButton({ children, ...props }: ComponentProps<"button">) {
  return (
    <button
      className="min-h-12 rounded-brand bg-brand-500 px-6 font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
}

export function FormAlert({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-brand bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center">
      <div className="w-full max-w-md rounded-brand border border-border bg-surface p-6 shadow-sm sm:p-8">
        <a href="/" className="text-2xl font-extrabold tracking-tight text-brand-600">
          Bizniss
        </a>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
