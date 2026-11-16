# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Bizniss**: a **local services marketplace** shipped as a **web app** plus **iOS and Android mobile apps**, with an **AI agent** integrated into all of them.

### Core flow

1. **Listings:** local businesses are listed and searchable on web and mobile.
2. **Quote request:** a customer selects a business (or describes the job) and requests a quote.
3. **AI quote:** the AI agent proposes an appointment date/time and cost.
4. **Booking:** the customer accepts the quote to confirm the appointment.
5. **Dispatch:** the AI agent sends the job request to a technician, who accepts and travels to the job site.
6. **Invoice and payment:** when the technician arrives, the AI agent emails the customer an invoice with a Stripe payment link.

### Roles

- **Customer:** browses businesses, requests quotes, books, pays.
- **Business:** manages its listing, services, pricing, availability and technicians.
- **Technician:** receives job requests, accepts or declines, completes jobs.
- **Admin:** moderates listings and handles disputes and refunds.

### AI agent rules

- Quotes and time slots must come from real business data (services, pricing rules, technician availability), never invented by the model.
- Actions with side effects (charging money, dispatching technicians, sending invoices) go through backend tools with validation, authorization and an audit log.
- Payments run only through the payment provider. The agent creates payment links but never handles card data.

### Business decisions

- Brand name: **Bizniss**. Orange colour scheme (tokens in `packages/shared/src/tokens.ts`).
- Launch country: **Pakistan**. Currency: **USD**. Money is stored as integer cents.
- Payments: **Stripe**. Customers pay **when the technician reaches the job site**: on `arrived`, an invoice with a Stripe payment link is emailed to the customer.
- Platform commission: **15% of the invoice price** (`splitCommission` in `packages/shared/src/money.ts`).
- Technicians are **independent contractors** (not employees of the businesses).
- Auth: **Supabase Auth**. Sign up with **name, email and phone** (Pakistani mobile); sign in with email.
- Database: **Supabase (Postgres)** with Row Level Security on every table.
- Email: **Resend** (invoices, booking updates).

### Stack and layout

- npm workspaces + Turborepo monorepo. Run `npm run dev:web` from the root (http://localhost:3000).
- `apps/web`: Next.js 16 (App Router, `cacheComponents` on) + Tailwind 4. Read `apps/web/AGENTS.md` and `node_modules/next/dist/docs/` before writing Next.js code; this version has breaking changes.
- `apps/mobile`: Expo (React Native) app for iOS and Android (planned).
- `packages/shared`: design tokens, zod schemas, types, money/commission helpers. Consumed as TypeScript source by web and mobile.

## Engineering rules

### Code quality and scalability

- Write clean, typed, modular code. Use TypeScript in strict mode for JS/TS code.
- Keep business logic, API access and AI-agent logic in shared modules, not duplicated per platform.
- Separate concerns: UI, state, data access, and services in their own layers.
- Design APIs and data models for growth: pagination, versioned endpoints, idempotent writes, background jobs for slow work.
- Keep linting/formatting (ESLint + Prettier) passing.
- No dead code, commented-out blocks, or unexplained magic values.

### Testing (required)

- **Always write tests for every piece of logic, every user flow and every UI component** in the same change that adds or modifies it. Work is not done until its tests exist and pass.
- **Logic** (shared helpers, schemas, server actions, API routes, agent tools): unit tests with Vitest. Mock external services (Supabase, Stripe, Resend, Anthropic); never hit real services in tests.
- **UI components and pages:** Vitest + React Testing Library (jsdom). Test rendering, accessibility (labels, roles), validation messages and user interactions.
- **Flows** (sign up, sign in, booking, payment, etc.): end-to-end tests with Playwright against the running web app, including a phone-sized viewport.
- Cover the failure paths too: invalid input, unauthorized access, service errors.
- Run `npm test` (unit/UI) and `npm run test:e2e` (flows) before committing.

### Security

- Never commit secrets. Use environment variables, and keep `.env*` files in `.gitignore` (commit only an `.env.example`).
- AI provider API keys live **server-side only**. Web and mobile clients call our backend, never the AI provider directly.
- Validate and sanitize all input on the server (e.g. with a schema validator such as Zod).
- Use proven auth (OAuth/OIDC or an established auth library); store tokens securely (httpOnly cookies on web, Keychain/Keystore via secure storage on mobile).
- Apply authorization checks on every endpoint, rate limiting on public and AI endpoints, and HTTPS everywhere.
- Set security headers (CSP, HSTS, X-Content-Type-Options, etc.) on the web app.
- AI agent safety: treat model output and tool-call arguments as untrusted, guard against prompt injection, limit agent tools to least privilege, and log agent actions.
- Keep dependencies patched; run `npm audit` (or equivalent) when adding packages.

### Dependencies

- Always use the **latest stable** versions of packages and frameworks when adding or upgrading them. Check the current version rather than relying on memory.
- Prefer well-maintained, widely used packages; avoid adding a dependency for trivial functionality.

### Git

- **Commit after every meaningful change** with a clear, descriptive message (what changed and why).
- Keep commits focused: one logical change per commit. Don't commit secrets, build output, or `node_modules`.

## UI / design rules

- **Mobile-first and responsive:** every web page must work well on phone screens (~360px wide) up to desktop. Use fluid layouts (flex/grid), relative units, and touch-friendly targets (min 44×44px).
- **Font:** use **Inter** everywhere (web: load Inter, fallback `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`; mobile: bundle Inter).
- **Border radius:** use **15px** for cards, buttons, inputs, modals and other rounded elements. Define it once as a design token (e.g. `--radius: 15px`) and reuse it on web and mobile.
- Keep design tokens (colors, spacing, radius, typography) in one shared place so web and mobile stay consistent.
- Meet accessibility basics: semantic HTML, labels for inputs, sufficient color contrast, keyboard navigation.
