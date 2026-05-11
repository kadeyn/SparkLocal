# SparkLocal

![Status: Pre-MVP Visual Prototype](https://img.shields.io/badge/Status-Pre--MVP%20Visual%20Prototype-orange)
![React 19](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38BDF8)

> A three-surface React/TypeScript prototype: a youth–business marketplace ("SparkLocal"), a gated founder-facing operator OS, and a gated owner OS for the business mentors who hire kids — all consuming the same brand system. Built as a high-fidelity, AI-augmented prototype suitable for fundraising demos and design QA, with a deliberate seam between mock data and real LLM calls.

---

## 1. What this is

SparkLocal is a youth-entrepreneurship marketplace connecting 11–18 year olds with verified local business owners and AI-suggested earning opportunities under a parent-approval umbrella. The codebase ships **three products** sharing one design system:

1. **Public app (`/`, `/onboarding/*`, `/app/*`)** — onboarding survey, opportunity feed, business detail, saved/messages, and a "Path" experience (Skill Tree, Constellation, Future Paths). Parent and business surfaces have their own signup and dashboard flows.
2. **Operator Portal (`/operator/*`)** — a hidden, password-gated founder console with two module groups (Operate / Finance) and seven views: Dashboard, Initiatives, Strategy AI (RAG-lite over a static knowledge base), Pitch, Roadmap, Cash Flow, Statements, LBO/M&A. Access is gated by a typed secret (`KADEYN`) or a dev keyboard shortcut (Ctrl/Cmd+Shift+O), then by password.
3. **Owner OS (`/owner/*`)** — a parallel, password-gated console built for the *business owners* (mentors) who hire kids on the platform, not the founder. Five views — Dashboard, Pipeline (kid candidates kanban), Initiatives (operational bets with AI scale/troubleshoot/kill verdicts), Finance (owner-specific P&L impact with cross-statement AI), and Playbook (RAG-lite over an owner-focused knowledge base of 22+ entries on delegation, hiring, pricing, compliance, tax credits, etc.). Access is gated by a typed secret (`MENTOR`) or a dev keyboard shortcut (Ctrl/Cmd+Shift+M), then by password.

All three surfaces run client-side. There is no backend in this repo. AI calls go directly to OpenRouter from the browser (see §6 for the security trade-off).

---

## 2. Tech stack & rationale

| Concern             | Choice                                  | Why                                                                    |
| ------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| UI framework        | **React 19** + **TypeScript**           | Concurrent rendering, stable; TS for refactor safety on a growing prototype. |
| Build               | **Vite 8**                              | Fast HMR; `tsc && vite build` keeps type-checking on the critical path. |
| Styling             | **Tailwind CSS 4** (`@tailwindcss/vite`) | Token-driven design system; no runtime CSS-in-JS overhead.             |
| Components          | **shadcn/ui** on **Radix primitives**   | Accessible, ownable, copy-in components — no library lock-in.          |
| Routing             | **React Router 7**                      | Code-split routes; nested operator layout with `useSearchParams` for module/tab state. |
| Animation           | **Framer Motion 12**                    | Shared-layout transitions in the operator portal; `useReducedMotion` honored in onboarding. |
| Client state        | **Zustand 5** + `persist` middleware    | Survey answers persisted to `localStorage` under `sparklocal-survey`; no Redux ceremony. |
| LLM                 | **OpenRouter** (model-agnostic)         | Primary + fallback model via env vars; swap providers without code changes. |
| Iconography         | **lucide-react**                        | Tree-shakable, consistent stroke.                                      |

Path aliasing: `@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

---

## 3. Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          src/App.tsx (routes)                        │
│  ┌──────────────────────────┐     ┌──────────────────────────────┐   │
│  │  Public + Marketplace    │     │  Operator Portal (gated)     │   │
│  │  Home / Onboarding /     │     │  Login → RequireOperator →   │   │
│  │  Feed / Business / Path  │     │  OperatorLayout (Operate /   │   │
│  │                          │     │  Finance module groups)      │   │
│  └────────────┬─────────────┘     └────────────┬─────────────────┘   │
│               │                                │                     │
│         ┌─────▼────────────────────────────────▼─────┐               │
│         │   src/lib  (cross-cutting concerns)        │               │
│         │   ai.ts → callAI() — cache + dedupe +      │               │
│         │   primary/fallback model + demo mode       │               │
│         │   surveyState.ts (Zustand)                 │               │
│         │   track.ts (analytics scaffold)            │               │
│         │   theme.ts, utils.ts                       │               │
│         └─────────────────┬───────────────────────────┘              │
│                           │                                          │
│              ┌────────────▼────────────┐                             │
│              │  src/data (mock domain) │                             │
│              │  businessOwners,        │                             │
│              │  aiIdeas, kidProfile,   │                             │
│              │  operator{Financials,   │                             │
│              │  CashFlow, Roadmap,     │                             │
│              │  Initiatives, KB...}    │                             │
│              └─────────────────────────┘                             │
└──────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────▼───────────────┐
              │   OpenRouter (HTTPS)          │
              │   primary model → on 429,     │
              │   transparent fallback model  │
              └───────────────────────────────┘
```

### Module map

```
src/
├── App.tsx                      # Routes + global dev keyboard shortcut
├── main.tsx                     # Root + BrowserRouter
├── components/
│   ├── brand/                   # Logo, BrandGradient (one source of brand truth)
│   ├── operator/
│   │   ├── OperatorLogin.tsx    # Password gate, 3-strike lockout w/ 30s cooldown
│   │   ├── RequireOperator.tsx  # sessionStorage-based auth guard
│   │   ├── OperatorLayout.tsx   # Group/tab switcher, URL-synced state
│   │   ├── DashboardView.tsx, KnowledgeView.tsx, PitchView.tsx
│   │   ├── operate/             # InitiativesView, InitiativeDeepDive, InitiativeCard
│   │   ├── finance/             # CashFlowView, RoadmapView, StatementsView, LBOView
│   │   └── shared/              # BriefingPanel, PlayCard, DemoDataBanner, DemoModePlaceholder
│   ├── owner/                   # Owner OS — parallel surface for business mentors
│   │   ├── OwnerLogin.tsx       # Password gate (mirrors operator pattern)
│   │   ├── RequireOwner.tsx     # Route-element guard
│   │   ├── OwnerLayout.tsx      # Top nav + nested route Outlet
│   │   └── DashboardView.tsx, PipelineView.tsx, InitiativesView.tsx,
│   │       FinanceView.tsx, PlaybookView.tsx
│   ├── path/                    # SkillTree, Constellation, Future
│   └── ui/                      # shadcn primitives (avatar, button, card, dialog, ...)
├── data/                        # All mock data — single source for demo realism
├── lib/
│   ├── ai.ts                    # Single entry point for LLM calls
│   ├── aiCache.ts               # In-memory cache + in-flight dedupe map
│   ├── surveyState.ts           # Zustand store, persisted
│   ├── track.ts                 # Analytics scaffold + typed event helpers
│   ├── theme.ts, utils.ts, useDebouncedValue.ts
└── pages/                       # Route components
```

---

## 4. The AI layer (`src/lib/ai.ts`)

A single `callAI()` function is the only thing that talks to a model. It encapsulates four behaviors I'd want before shipping any LLM-backed feature, even in a prototype:

1. **Demo mode short-circuit.** If `VITE_AI_DEMO_MODE === 'true'`, return the caller's `mockResponse` after a 600ms simulated delay. This makes the operator portal fully demoable offline, with deterministic copy for screenshots.
2. **Response cache** keyed on `(prompt, system, json)` — same call, same session, zero token spend.
3. **In-flight deduplication.** Two components mounting at once that fire identical prompts share a single Promise; the second caller awaits the first. Prevents thundering-herd on cold cache.
4. **Graceful model fallback on 429.** Primary model rate-limited? Transparently retry against `VITE_OPENROUTER_FALLBACK_MODEL`. If fallback also 429s, the original error propagates so the UI can render a rate-limit state.

The `bypassCache` flag lets users force-regenerate (e.g., "Re-run synthesis"); it deletes the old entry on success rather than holding two answers in memory.

Errors thrown by `callAI` are normalized to an `AIError` with `status` and `isRateLimit` so views can branch on them without parsing strings.

---

## 5. State, routing, and other engineering notes

- **URL-driven module state.** The operator portal stores its current group/tab in `useSearchParams` (`?group=finance&tab=cashflow`), so any view is deep-linkable and back-button-correct. No global UI store.
- **Survey persistence.** `useSurveyStore` (Zustand + `persist`) survives reload under key `sparklocal-survey`. `markComplete()` stamps an ISO timestamp.
- **Operator gating, layered.**
  - *Discovery:* hidden — type `KADEYN` anywhere on the home page (with a 3s buffer timeout, ignores form inputs), or in dev only, press Ctrl/Cmd+Shift+O.
  - *Auth:* password-checked against `VITE_OPERATOR_PASSWORD`; 3 failed attempts triggers a 30s lockout with countdown UI and a shake animation. Auth flag lives in `sessionStorage` (cleared on tab close — intentional, since this is not a real auth system).
  - *Route guard:* `RequireOperator` short-circuits to `/operator/login` if the flag is missing.
- **Analytics scaffold.** `track()` logs to console in dev and exposes typed helpers (`trackPathViewed`, `trackOperatorInitiativeOpened`, etc.). The PostHog/Mixpanel wiring is a one-line addition when it's time.
- **Accessibility.** Onboarding respects `useReducedMotion`. Radix primitives bring focus management and ARIA out of the box.

---

## 6. Known limitations & deliberate trade-offs

A Sr. SWE telling you the truth about what's not production-ready:

- **API key in the browser bundle.** `VITE_OPENROUTER_API_KEY` is shipped to the client. This is called out at the top of `src/lib/ai.ts`. Before any public deployment, AI calls must move behind a server function (Supabase Edge Function / Vercel Function), the `VITE_` prefix dropped, and the key rotated.
- **Operator auth is client-side only.** Password check, lockout counter, and session flag all live in the browser. Replace with real auth (Supabase Auth, Clerk, or NextAuth) before any non-demo access.
- **AI cache is in-memory and per-tab.** Survives navigation; dies on reload. Acceptable for a demo; swap to `IndexedDB` or a server cache for persistence across sessions.
- **All data is mocked** under `src/data/*`. There is no persistence beyond `localStorage` for the survey. No real opportunities, no real owners, no real messages.
- **No tests.** This is a visual prototype. Adding Vitest + React Testing Library + Playwright is on the critical path before this becomes an MVP.
- **No CI.** `npm run lint` runs `tsc --noEmit` only; no ESLint, Prettier, or pre-commit hooks configured.
- **`window.location.origin` in the `HTTP-Referer` header.** Fine in the browser; would need swapping out if `callAI` ever runs server-side.

---

## 7. Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
npm install
npm run dev          # http://localhost:5173
```

### Scripts

| Command            | What it does                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Vite dev server with HMR                  |
| `npm run build`    | `tsc` then `vite build` (type-check gates the build) |
| `npm run preview`  | Serve the production build locally        |
| `npm run lint`     | Type-check only (`tsc --noEmit`)          |

### Environment variables

Create a `.env.local` at the repo root. **Demo mode requires no API key** and is the right default for design/QA work:

```bash
# AI provider — currently only "openrouter" is implemented
VITE_AI_PROVIDER=openrouter

# Set to "true" to use mock responses (no network, deterministic, free)
VITE_AI_DEMO_MODE=true

# Required when VITE_AI_DEMO_MODE != "true"
VITE_OPENROUTER_API_KEY=sk-or-...
VITE_OPENROUTER_MODEL=anthropic/claude-sonnet-4-6
VITE_OPENROUTER_FALLBACK_MODEL=openai/gpt-4o-mini   # optional, used on 429

# Operator portal gate
VITE_OPERATOR_PASSWORD=change-me

# Owner OS gate
VITE_OWNER_PASSWORD=change-me
```

### Accessing the Operator Portal

1. Navigate to `/`.
2. Type `KADEYN` (case-insensitive) anywhere outside an input — or in dev, press **Ctrl/Cmd + Shift + O**.
3. Enter the password from `VITE_OPERATOR_PASSWORD`.
4. Use the **Operate / Finance** switcher in the header to change module groups; tabs are URL-synced.

### Accessing the Owner OS

1. Navigate to `/owner`.
2. Type `MENTOR` (case-insensitive) anywhere outside an input — or in dev, press **Ctrl/Cmd + Shift + M**.
3. Enter the password from `VITE_OWNER_PASSWORD`.
4. The five modules — Dashboard, Pipeline, Initiatives, Finance, Playbook — are path-based routes under `/owner/*`, deep-linkable, back-button-correct.

The Owner OS auth model is identical in design to the Operator Portal: client-side password check, 3-strike lockout with 30-second cooldown, `sessionStorage` flag at `sparklocal-owner-auth`, cleared on tab close. This is **not real auth** — same trade-off as the operator portal (see §6).

---

## 8. Roadmap (what I'd do next)

1. Move `callAI` behind a Supabase Edge Function; rotate keys.
2. Replace operator password gate with Supabase Auth + role-based access (operator role).
3. Persist survey answers and opportunity-saves to Postgres; back the marketplace feed with real data.
4. Wire `track()` to PostHog; add a server-side proxy for sensitive events.
5. Add Vitest unit tests for `ai.ts` (cache key shape, fallback path, demo mode), `surveyState`, and the operator route guard.
6. Add Playwright smoke tests for the four critical flows: kid onboarding → results, business signup → dashboard, operator login (success + lockout), and an operator AI synthesis cycle (regenerate + 429 fallback).
7. Lighthouse + Axe pass on public surfaces; tighten focus traps in modals.

---

## 9. Compliance posture (as of 2026-05-11)

SparkLocal V1 launches at 13+ only. Explorer track (ages 11-13) infrastructure exists in code but is gated behind `COMPLIANCE_CONFIG.explorerTrackEnabled = false`. Expansion to 11-13 is targeted for month 12-18 post-launch, contingent on operational maturity and legal review.

Compliance baselines (always-on):
- Notification blackout per CA SB 976 / NY SAFE Act standards applied to all minors regardless of jurisdiction
- Data retention windows defined in `src/lib/dataRetention.ts` per COPPA amended rule
- Separate verifiable parental consent scaffolding for third-party disclosures
- Audit log retention for child-safety review

Features deferred to subsequent implementation prompts:
- Parent-mediated payment architecture (prompt 2)
- Open Badges 3.0 credential issuer (prompt 2)
- Daily-bounded gig discovery feed (prompt 3)
- Path tab restructure to My Path + Explore (prompt 3)
- Family Plan dual-priority system (prompt 4)
- AI cost router and quotas (prompt 5)

Hard rules (will not be implemented regardless of future business pressure):
- No virtual currency redeemable for real money
- No targeted advertising to users under 17
- No engagement-optimizing recommenders using inferred behavioral signals
- No loot box, gacha, or variable-ratio random reward mechanics
- No proactive AI messages to minors

---

## 10. Credential infrastructure

SparkLocal issues Open Badges 3.0 / W3C Verifiable Credentials (Data Model v2.0) for kid skill achievements, gig completions, and milestones. Implementation:

- **Signing:** `Ed25519Signature2020` via `@digitalbazaar/vc`
- **Issuer DID:** Generated via `npm run generate:ob-keys`; controlled by SparkLocal in V1 (env-var-backed)
- **Key management:** Pluggable `KeyProvider` interface in `src/lib/credentials/keyProvider.ts`. V1 uses `EnvVarKeyProvider`; the production migration path to AWS KMS / HashiCorp Vault is the same interface with a different impl
- **Issuance flow:** mentor proposes a badge after a completed gig → kid sees the proposal in their portfolio → kid explicitly accepts or declines → on acceptance, the credential is signed and added to the kid's portfolio
- **Portability:** credentials conform to W3C VC v2.0 and are importable by any compliant wallet (e.g. Learner Credential Wallet)

The mentor-proposes / kid-accepts flow is a deliberate design choice from research brief Section 2 — autonomy-supportive curation rather than passive system issuance.

Surfaces:
- Mentor side: **Owner OS → Badges** tab (`/owner/badges`) — propose a badge, watch your funnel
- Kid side: **My Badges** (`/app/badges`) — pending proposals, accepted portfolio, JSON / print export, click-to-verify
- Operator side: **Finance → Badges** tab in the operator portal — issuance volume, acceptance funnel, signing-key health

### Production hardening checklist (deferred)

- [ ] Move private signing key from env var to KMS
- [ ] Implement key rotation (12-month default)
- [ ] Hand-cache the Open Badges 3.0 context (`purl.imsglobal.org/spec/ob/v3p0/...`) — currently falls through to an empty-document stub which is sufficient for V1 demo but won't satisfy strict third-party verifiers
- [ ] Implement credential revocation (`StatusList2021`)
- [ ] Move `BadgeProposalProvider` from `localStorage` to Supabase
- [ ] Add real badge artwork (V1 uses fallback `Award` icons)

---

## 11. Feed and Path UX architecture

### Daily-bounded feed
Per research brief §7, SparkLocal does NOT use an infinite-scroll feed. The kid's daily discovery surface presents 5-8 swipeable opportunity cards (5 for Explorer track when enabled, 8 for Builder/Pro). When the daily set is exhausted, an explicit "that's it for today" state surfaces with the next refresh time and a CTA to the Explore surface.

Mechanics:
- Swipe right (interested), left (not for me), up (save for later)
- 200ms transition cooldown between cards — friction by design
- Undo affordance after each swipe (4-second window)
- Session timer surfaces a "take a break?" nudge at 15 minutes (Prompt 5 will wire AI-aware pacing into this)
- No "load more" button, no infinite scroll, no auto-refresh
- Card visual register varies by track; mechanics are identical across tracks

State management: `useDailyFeedStore` (Zustand + `localStorage` at key `sparklocal-daily-feed`), date-keyed sets with 7-day rolling garbage collection on rehydrate. Real backing API replaces the mock generator in a later prompt.

### Path tab restructure
The previous three-tab structure (Skill Tree | Constellation | Future) collapses to two:

- **My Path** — progression + planning. Current focus node, 2-4 adjacent next steps, hinted long-term goals, accepted badges (from the Open Badges issuer). The post-gig / weekly-return surface.
- **Explore** — browse the constellation of possibilities. Finite 8-12 cards per visit, refreshable but not infinite, "Add to my path" affordance. The exploration surface.

Default tab on first visit is inferred from work history — kids with completed jobs land on My Path; kids without land on Explore. URL-driven via `?tab=mypath` / `?tab=explore`.

The legacy `SkillTree.tsx`, `Constellation.tsx`, and `Future.tsx` components remain in the tree marked `@deprecated` for one release cycle in case rollback is needed.

---

## License

MIT
