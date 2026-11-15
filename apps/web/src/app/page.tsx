import {
  CATEGORIES,
  CATEGORY_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "@bizniss/shared";

const steps = [
  { title: "Choose a business", text: "Browse verified doctors, salons, plumbers and more near you." },
  { title: "Get an AI quote", text: "Our AI assistant finds a free time slot and gives you the exact cost." },
  { title: "Pay & confirm", text: "Pay securely with JazzCash, Easypaisa or PayFast to lock your booking." },
  { title: "Get it done", text: "A professional is assigned and your invoice arrives by email." },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="text-2xl font-extrabold tracking-tight text-brand-600">
            Bizniss
          </a>
          <div className="flex items-center gap-2">
            <a
              href="#how"
              className="hidden min-h-11 items-center px-3 text-sm font-medium text-muted sm:flex"
            >
              How it works
            </a>
            <a
              href="#business"
              className="flex min-h-11 items-center rounded-brand bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
            >
              List your business
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand-100 to-background">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Book trusted local services <span className="text-brand-600">in minutes</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Tell us what you need. Our AI assistant finds the right professional, picks a time and
              gives you the price, instantly.
            </p>

            <form
              action="/businesses"
              className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
              role="search"
            >
              <label htmlFor="q" className="sr-only">
                What do you need?
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
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="categories">
          <h2 id="categories" className="text-2xl font-bold">
            Popular categories
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

        <section id="how" className="bg-surface py-12" aria-labelledby="how-title">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="how-title" className="text-2xl font-bold">
              How Bizniss works
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-brand border border-border bg-background p-5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-500 font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="business" className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-brand bg-brand-600 p-8 text-white sm:p-10">
            <h2 className="text-2xl font-bold">Grow your practice or business</h2>
            <p className="mt-2 max-w-xl text-brand-100">
              List for free and get paid bookings from new customers. We only charge a 10%
              commission on each appointment.
            </p>
            <a
              href="/business/signup"
              className="mt-6 inline-flex min-h-11 items-center rounded-brand bg-white px-5 font-semibold text-brand-700"
            >
              Get started
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>© Bizniss</p>
          <p>Payments: {PAYMENT_METHODS.map((m) => PAYMENT_METHOD_LABELS[m]).join(" · ")}</p>
        </div>
      </footer>
    </>
  );
}
