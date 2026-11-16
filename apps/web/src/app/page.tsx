import type { Metadata } from "next";
import { CATEGORIES, CATEGORY_LABELS } from "@bizniss/shared";
import { marketingUrl } from "@/lib/urls";

export const metadata: Metadata = { title: "Find a service" };

/** App home (app subdomain): straight into search and categories. */
export default function AppHome() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-brand-600">
            Bizniss
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/signin"
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-ink hover:text-brand-600"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="flex min-h-11 items-center rounded-brand bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Sign up
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">What do you need today?</h1>
        <form action="/businesses" className="mt-6 flex flex-col gap-3 sm:flex-row" role="search">
          <label htmlFor="q" className="sr-only">
            Search services
          </label>
          <input
            id="q"
            name="q"
            placeholder="e.g. Skin specialist, AC repair, haircut"
            className="min-h-12 flex-1 rounded-brand border border-border bg-surface px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
          <button
            type="submit"
            className="min-h-12 rounded-brand bg-brand-500 px-6 font-semibold text-white hover:bg-brand-600"
          >
            Search
          </button>
        </form>

        <section className="mt-10" aria-labelledby="categories">
          <h2 id="categories" className="text-xl font-bold">
            Browse by category
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <a
                  href={`/businesses?category=${c}`}
                  className="flex min-h-20 items-center justify-center rounded-brand border border-border bg-surface p-4 text-center font-semibold hover:border-brand-500 hover:text-brand-600"
                >
                  {CATEGORY_LABELS[c]}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:justify-between">
          <a href={marketingUrl("/")} className="hover:text-brand-600">
            About Bizniss
          </a>
          <p>Secure card payments by Stripe · Prices in USD</p>
        </div>
      </footer>
    </>
  );
}
