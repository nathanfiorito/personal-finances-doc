# Design: persona-finances-doc — Documentation Site

**Date:** 2026-04-13
**Status:** Approved

---

## Overview

A personal reference hub for the Personal Finances project, built as a standalone Nextra documentation site in its own repository (`persona-finances-doc`). The goal is a well-organized, navigable reference — not a public-facing product page. Styling and theming will be applied in a later phase once the frontend design system is finalized.

---

## Tool

**Nextra** (Next.js-based static documentation framework).

Rationale:
- Aligns with the existing Next.js/React/TypeScript stack — no context switching for customization.
- File-based routing mirrors Next.js App Router conventions already in use.
- Theming is first-class: one `theme.config.tsx` file controls the entire look.
- MDX support allows embedding React components and interactive content later.

---

## Audience

Single user — personal reference only. No public registration, no multi-user access.

---

## Structure Approach

**Hybrid** — nested where content is dense, flat where it fits on one page.

| Section | Structure | Rationale |
|---|---|---|
| Architecture | Nested (4 sub-pages) | Backend, frontend, and bot flows are distinct enough to deserve separate pages |
| API Reference | Nested (5 sub-pages) | One page per resource group prevents a wall of endpoints |
| Database | Flat (1 page) | Schema and indexes fit cleanly in a single structured page |
| Security | Flat (1 page) | Checklist-style content is self-contained |
| Roadmap | Flat (1 page) | Single timeline/milestone view |

---

## Folder Structure

```
persona-finances-doc/
├── pages/
│   ├── _meta.json                  ← top-level nav order
│   ├── index.md                    ← home / project overview
│   │
│   ├── architecture/
│   │   ├── _meta.json
│   │   ├── index.md                ← overview + hexagonal diagram
│   │   ├── backend.md              ← FastAPI layers, package layout
│   │   ├── frontend.md             ← Next.js structure, pages, auth flow
│   │   └── telegram-bot.md         ← bot flow, message handling, confirmation
│   │
│   ├── api-reference/
│   │   ├── _meta.json
│   │   ├── index.md                ← auth, base URL, error codes
│   │   ├── transactions.md         ← CRUD /api/v2/transactions
│   │   ├── categories.md           ← /api/v2/categories
│   │   ├── reports.md              ← /api/v2/reports/summary + monthly
│   │   └── export.md               ← /api/v2/export/csv
│   │
│   ├── database/
│   │   └── index.md                ← schema, tables, indexes, relationships
│   │
│   ├── security/
│   │   └── index.md                ← auth model, webhook validation, checklist
│   │
│   └── roadmap/
│       └── index.md                ← milestones, current status, future plans
│
├── public/                         ← static assets (diagrams, images)
├── theme.config.tsx                ← Nextra theme config (logo, nav, footer)
├── next.config.mjs                 ← Nextra plugin setup
├── package.json
└── tsconfig.json
```

---

## Content Per Page

### `pages/index.md`
- One-paragraph project description
- Tech stack summary (backend, frontend, infra)
- Links to the five main sections

### `pages/architecture/index.md`
- High-level system diagram (Telegram → Backend → Supabase → Frontend)
- Hexagonal architecture overview
- Links to sub-pages

### `pages/architecture/backend.md`
- Hexagonal layer breakdown (domain, ports, use cases, adapters)
- Package layout tree
- Key design decisions (OpenRouter, two models, mandatory confirmation)

### `pages/architecture/frontend.md`
- Next.js App Router structure
- Auth flow (Supabase SSR, middleware, cookie session)
- Page inventory (Dashboard, Expenses, Reports, Categories)

### `pages/architecture/telegram-bot.md`
- Bot request flow (webhook → handler → use case → confirmation → persist)
- In-memory pending state (TTL, keying by chat_id)
- Bot commands table

### `pages/api-reference/index.md`
- Base URL
- Authentication (Supabase JWT, Authorization header)
- Common error codes (401, 403, 422, 500)
- Rate limiting notes

### `pages/api-reference/transactions.md`
- `GET /api/v2/transactions` — list with filters
- `POST /api/v2/transactions` — create
- `GET /api/v2/transactions/{id}` — get by ID
- `PUT /api/v2/transactions/{id}` — update
- `DELETE /api/v2/transactions/{id}` — delete

### `pages/api-reference/categories.md`
- `GET /api/v2/categories`
- `POST /api/v2/categories`
- `PATCH /api/v2/categories/{id}`
- `DELETE /api/v2/categories/{id}` — deactivates, does not hard-delete

### `pages/api-reference/reports.md`
- `GET /api/v2/reports/summary`
- `GET /api/v2/reports/monthly`

### `pages/api-reference/export.md`
- `GET /api/v2/export/csv`

### `pages/database/index.md`
- `transactions` table — all columns, types, constraints
- `categories` table — all columns, types, constraints
- Indexes and foreign keys
- Default category seed values

### `pages/security/index.md`
- Auth model (Supabase Auth, JWT, single-user)
- Webhook validation (X-Telegram-Bot-Api-Secret-Token)
- Chat ID restriction (TELEGRAM_ALLOWED_CHAT_ID)
- OpenAPI hidden in production
- CORS policy

### `pages/roadmap/index.md`
- Current status (what's live)
- MVP milestones (completed / in progress / planned)
- Future plans / backlog ideas

---

## Out of Scope (Phase 1)

- Custom theming or visual design (deferred until frontend design system is ready)
- Search indexing configuration
- Deployment setup (Vercel / GitHub Pages)
- MDX components or interactive elements
