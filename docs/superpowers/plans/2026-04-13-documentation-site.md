# Documentation Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the `personal-finances-doc` Nextra documentation site with full folder structure and skeleton markdown content for all five sections.

**Architecture:** Nextra v2 (pages router) with `nextra-theme-docs`. Each section lives under `pages/` as either a flat `index.md` (Database, Security, Roadmap) or a sub-folder with multiple pages (Architecture, API Reference). Navigation is controlled by `_meta.json` files at each level.

**Tech Stack:** Nextra 2.x, Next.js 14, React 18, TypeScript

---

### Task 1: Initialize the Nextra project

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `theme.config.tsx`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "personal-finances-doc",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.29",
    "nextra": "2.13.4",
    "nextra-theme-docs": "2.13.4",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create `next.config.mjs`**

```js
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

export default withNextra({})
```

- [ ] **Step 3: Create `theme.config.tsx`**

```tsx
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Personal Finances</span>,
  project: {
    link: 'https://github.com/nathanfiorito/personal-finances',
  },
  docsRepositoryBase: 'https://github.com/nathanfiorito/personal-finances-doc',
  footer: {
    text: 'Personal Finances — private reference docs',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Personal Finances Docs',
    }
  },
}

export default config
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules/
.next/
out/
.env
.env.local
*.log
```

- [ ] **Step 6: Install dependencies**

Run from `personal-finances-doc/`:
```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json next.config.mjs theme.config.tsx tsconfig.json .gitignore package-lock.json
git commit -m "chore: initialize Nextra documentation project"
```

---

### Task 2: Create home page and top-level navigation

**Files:**
- Create: `pages/_meta.json`
- Create: `pages/index.md`

- [ ] **Step 1: Create `pages/_meta.json`**

```json
{
  "index": "Home",
  "architecture": "Architecture",
  "api-reference": "API Reference",
  "database": "Database",
  "security": "Security",
  "roadmap": "Roadmap"
}
```

- [ ] **Step 2: Create `pages/index.md`**

```markdown
# Personal Finances

Personal expense tracking system — Telegram bot + web dashboard.

## What is this?

Personal Finances is a private, single-user expense tracking system. It consists of:

- A **Telegram bot** that receives payment receipts (photo, PDF, or text), extracts and categorizes expenses using AI, and sends a confirmation before saving
- A **web dashboard** (Next.js) for viewing, filtering, and managing expenses
- A **FastAPI backend** with hexagonal architecture connecting both

## Stack

| Component | Technologies |
|---|---|
| Backend | Python 3.12, FastAPI, hexagonal architecture |
| LLM | Claude Sonnet 4.6 (vision/reports), Haiku 4.5 (text/categorization) via OpenRouter |
| Database | Supabase (PostgreSQL) |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Hosting | Render (backend), Vercel (frontend) |

## Sections

- [Architecture](/architecture) — system design, hexagonal layers, request flows
- [API Reference](/api-reference) — REST endpoints, authentication, error codes
- [Database](/database) — schema, tables, indexes, relationships
- [Security](/security) — auth model, webhook validation, access control
- [Roadmap](/roadmap) — milestones and future plans
```

- [ ] **Step 3: Verify dev server**

Run:
```bash
npm run dev
```

Open `http://localhost:3000` — expect the home page to render with the sidebar showing all 5 sections.

- [ ] **Step 4: Commit**

```bash
git add pages/
git commit -m "docs: add home page and top-level navigation"
```

---

### Task 3: Create Architecture section

**Files:**
- Create: `pages/architecture/_meta.json`
- Create: `pages/architecture/index.md`
- Create: `pages/architecture/backend.md`
- Create: `pages/architecture/frontend.md`
- Create: `pages/architecture/telegram-bot.md`

- [ ] **Step 1: Create `pages/architecture/_meta.json`**

```json
{
  "index": "Overview",
  "backend": "Backend",
  "frontend": "Frontend",
  "telegram-bot": "Telegram Bot"
}
```

- [ ] **Step 2: Create `pages/architecture/index.md`**

```markdown
# Architecture Overview

Personal Finances follows a hexagonal (ports & adapters) architecture on the backend, with a clear separation between the Telegram bot interface, the REST API, and the business logic layer.

## System Components

```
┌─────────────────┐     ┌──────────────────────────────────┐     ┌──────────────┐
│  Telegram App   │────▶│           FastAPI Backend         │────▶│   Supabase   │
│  (user sends    │     │  ┌─────────────┐ ┌─────────────┐ │     │ (PostgreSQL) │
│   receipts)     │     │  │ Telegram    │ │  REST API   │ │     └──────────────┘
└─────────────────┘     │  │ Adapter     │ │  (BFF)      │ │
                        │  └─────────────┘ └─────────────┘ │     ┌──────────────┐
                        │        │                │         │────▶│  OpenRouter  │
                        │        ▼                ▼         │     │  (LLM API)   │
                        │  ┌─────────────────────────────┐  │     └──────────────┘
                        │  │     Domain / Use Cases      │  │
                        │  └─────────────────────────────┘  │
                        └──────────────────────────────────┘
                                        ▲
                        ┌───────────────┘
                        │
                ┌───────────────┐
                │  Next.js      │
                │  Dashboard    │
                └───────────────┘
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| OpenRouter instead of Anthropic direct | OpenAI-compatible SDK; easier model switching |
| Two LLM models | Sonnet 4.6 for vision/reports (quality); Haiku 4.5 for text tasks (cost) |
| Mandatory confirmation | Never persist an expense without explicit user approval |
| In-memory pending state | Keeps DB clean; TTL 10 min to auto-expire unconfirmed entries |
| OpenAPI hidden in production | Security hardening; enabled only in development |

## Sub-sections

- [Backend](/architecture/backend) — hexagonal layers, package layout
- [Frontend](/architecture/frontend) — Next.js structure, auth flow
- [Telegram Bot](/architecture/telegram-bot) — bot flow, commands, confirmation
```

- [ ] **Step 3: Create `pages/architecture/backend.md`**

```markdown
# Backend Architecture

The backend is a Python/FastAPI application following the hexagonal (ports & adapters) pattern. All business logic lives in the domain layer with zero framework or database imports.

## Hexagonal Layers

```
Primary Adapters (BFF, Telegram) → Domain (Use Cases + Ports) ← Secondary Adapters (Supabase, OpenRouter, etc.)
```

| Layer | Location | Responsibility |
|---|---|---|
| Domain Entities | `src/v2/domain/entities/` | Pure data types — `Expense`, `Category` |
| Domain Exceptions | `src/v2/domain/exceptions.py` | `ExpenseNotFoundError`, etc. |
| Domain Ports | `src/v2/domain/ports/` | Abstract interfaces for all external dependencies |
| Domain Use Cases | `src/v2/domain/use_cases/` | All business logic — no framework or DB imports |
| Secondary Adapters | `src/v2/adapters/secondary/` | Supabase repos, OpenRouter LLM, Telegram notifier, in-memory pending state |
| Primary Adapters | `src/v2/adapters/primary/` | BFF REST router (`/api/v2/...`) + Telegram webhook handler |
| Bootstrap | `src/v2/bootstrap.py` | Wires all adapters into use cases; builds the FastAPI router |

## Package Layout

```
src/
├── config/settings.py          — Pydantic settings (env vars)
├── main.py                     — FastAPI app + lifespan + webhook endpoint
├── scheduler/reports.py        — APScheduler: monthly auto-report (1st of month, 08:00 BRT)
└── services/
    ├── llm.py                  — OpenRouter HTTP client with retry + tracing
    ├── telegram.py             — Telegram Bot API helpers
    └── tracing.py              — OpenTelemetry span helpers

src/v2/
├── bootstrap.py
├── domain/
│   ├── entities/               — Expense, Category (dataclasses)
│   ├── exceptions.py
│   ├── ports/                  — ABC interfaces
│   └── use_cases/
│       ├── expenses/           — CreateExpense, ListExpenses, GetExpense, UpdateExpense, DeleteExpense
│       ├── categories/         — ListCategories, CreateCategory, UpdateCategory, DeactivateCategory
│       ├── reports/            — GenerateSummary, GenerateMonthly
│       └── telegram/           — ProcessMessage, ConfirmExpense, HandleCommand
└── adapters/
    ├── primary/
    │   ├── bff/                — REST API (/api/v2/...)
    │   └── telegram/           — Webhook router + handlers
    └── secondary/
        ├── supabase/           — Expense + category repositories
        ├── openrouter/         — LLM adapter
        ├── telegram_api/       — Telegram notifier
        └── memory/             — In-memory pending state (TTL 10 min)
```

## Architecture Contracts

Enforced at test time by `import-linter` (`tests/v2/test_architecture.py`):

- Domain never imports from adapters
- Secondary adapters never import from primary adapters
- Entities and ports never import from use cases

## LLM Strategy

| Model | Tasks | Reason |
|---|---|---|
| `anthropic/claude-sonnet-4-6` | Image/PDF extraction, monthly reports | Needs vision capability and higher quality reasoning |
| `anthropic/claude-haiku-4-5` | Text extraction, categorization, duplicate checking | High volume, lower cost |

Both models are accessed via OpenRouter using the OpenAI-compatible SDK pointed at `openrouter.ai/api/v1`.
```

- [ ] **Step 4: Create `pages/architecture/frontend.md`**

```markdown
# Frontend Architecture

The frontend is a Next.js 16 application using the App Router. It consumes the backend REST API and authenticates via Supabase Auth (email + password).

## Structure

```
personal-finances-frontend/
├── src/app/
│   ├── (auth)/
│   │   └── login/              — Login page (public)
│   ├── dashboard/              — Current month summary
│   ├── expenses/               — Expense list, filters, CRUD modal
│   ├── reports/                — Monthly bar chart + category breakdown
│   └── categories/             — Category list + CRUD
├── middleware.ts                — Protects all routes except /login
└── lib/
    ├── supabase/               — Supabase SSR client helpers
    └── api/                    — fetch wrappers with auth headers
```

## Auth Flow

1. User visits any route → `middleware.ts` checks for Supabase session cookie
2. No session → redirect to `/login`
3. User submits email + password → Supabase Auth validates → JWT stored in cookie
4. Redirect to `/dashboard`
5. All API calls include `Authorization: Bearer <jwt>` header
6. `401`/`403` from API → auto-redirect to `/login`

## Pages

| Route | Component | Data Source |
|---|---|---|
| `/login` | Login form | Supabase Auth |
| `/dashboard` | Summary cards + pie chart | `GET /api/v2/reports/summary` (current month) |
| `/expenses` | Paginated table + modal | `GET /api/v2/transactions` |
| `/reports` | Bar chart + table | `GET /api/v2/reports/monthly` |
| `/categories` | List + inline CRUD | `GET /api/v2/categories` |

## Behaviors

- Dashboard always loads the current month — no period selector on that page
- Expense table paginates at 20 items/page with date range and category filters
- All writes (create, edit, delete) show toast feedback
- All async calls show a loading state
- Category "delete" deactivates — never hard-deletes
```

- [ ] **Step 5: Create `pages/architecture/telegram-bot.md`**

```markdown
# Telegram Bot

The bot receives receipts via webhook (photo, PDF, or text), extracts expense data using AI, asks for confirmation, and persists only after explicit user approval.

## Request Flow

```
1. User sends receipt (photo / PDF / text)
        │
        ▼
2. POST /webhook → validate X-Telegram-Bot-Api-Secret-Token + TELEGRAM_ALLOWED_CHAT_ID
        │
        ▼
3. Route by input type → ProcessMessage use case
        │
        ▼
4. LLMPort.extract_expense() → structured expense data
        │
        ▼
5. Store in InMemoryPendingStateAdapter (keyed by chat_id, TTL 10 min)
        │
        ▼
6. Bot sends confirmation message with inline keyboard [✅ Confirm] [❌ Cancel]
        │
        ├── User clicks ❌ Cancel → discard pending state
        │
        └── User clicks ✅ Confirm → ConfirmExpense use case
                │
                ▼
           LLMPort.check_duplicate() → compare against 3 most recent expenses
                │
                ├── Duplicate detected → bot warns user, asks to override
                │
                └── No duplicate (or user overrides) → ExpenseRepository.save()
```

## Bot Commands

| Command | Description |
|---|---|
| `/start` | Welcome message |
| `/ajuda` | List all available commands |
| `/relatorio` | Report for current month |
| `/relatorio semana` | Report for current week |
| `/relatorio anterior` | Report for previous month |
| `/relatorio mes` | Report for current month |
| `/relatorio MM/AAAA` | Report for a specific month |
| `/exportar` | Export current month as CSV |
| `/exportar semana\|anterior\|mes\|MM/AAAA` | Export for a specific period |
| `/categorias` | List active categories |
| `/categorias add <name>` | Add a new category |

## Pending State

- Stored in-memory in `InMemoryPendingStateAdapter`
- Keyed by `chat_id` (one pending expense per chat at a time)
- TTL: 10 minutes — auto-expires unconfirmed entries
- Not persisted across server restarts

## Security

- Webhook URL protected by `X-Telegram-Bot-Api-Secret-Token` header
- All messages from chat IDs other than `TELEGRAM_ALLOWED_CHAT_ID` are silently ignored
```

- [ ] **Step 6: Verify all architecture pages in browser**

With `npm run dev` running, open:
- `http://localhost:3000/architecture` — expect overview with diagram
- `http://localhost:3000/architecture/backend` — expect layer table + package tree
- `http://localhost:3000/architecture/frontend` — expect structure + auth flow
- `http://localhost:3000/architecture/telegram-bot` — expect flow + commands table

- [ ] **Step 7: Commit**

```bash
git add pages/architecture/
git commit -m "docs: add architecture section (overview, backend, frontend, telegram-bot)"
```

---

### Task 4: Create API Reference section

**Files:**
- Create: `pages/api-reference/_meta.json`
- Create: `pages/api-reference/index.md`
- Create: `pages/api-reference/transactions.md`
- Create: `pages/api-reference/categories.md`
- Create: `pages/api-reference/reports.md`
- Create: `pages/api-reference/export.md`

- [ ] **Step 1: Create `pages/api-reference/_meta.json`**

```json
{
  "index": "Overview",
  "transactions": "Transactions",
  "categories": "Categories",
  "reports": "Reports",
  "export": "Export"
}
```

- [ ] **Step 2: Create `pages/api-reference/index.md`**

```markdown
# API Reference

REST API for the Personal Finances frontend. All endpoints are under `/api/v2/`.

## Base URL

```
Production: https://personal-finances-backend.onrender.com
Development: http://localhost:8000
```

## Authentication

All `/api/v2/*` routes require a Supabase Auth JWT:

```http
Authorization: Bearer <jwt>
```

The JWT is obtained after login via Supabase Auth and stored in the session cookie. It is sent automatically by the frontend on every API call.

## Common Error Codes

| Code | Situation |
|---|---|
| `401 Unauthorized` | Header missing, malformed, or invalid token |
| `403 Forbidden` | Token expired |
| `404 Not Found` | Resource does not exist |
| `422 Unprocessable Entity` | Validation error — check request body |
| `500 Internal Server Error` | Unexpected server error |

## CORS

Accepts origins matching `*.nathanfiorito.com.br` with methods `GET, POST, PUT, PATCH, DELETE`.

## Health Check

```http
GET /health
```

Response `200 OK`:
```json
{ "status": "ok" }
```

No authentication required.
```

- [ ] **Step 3: Create `pages/api-reference/transactions.md`**

```markdown
# Transactions

Endpoints for managing expense transactions.

---

## List Transactions

```http
GET /api/v2/transactions
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `start_date` | `YYYY-MM-DD` | Filter from this date (inclusive) |
| `end_date` | `YYYY-MM-DD` | Filter to this date (inclusive) |
| `category_id` | `integer` | Filter by category |
| `page` | `integer` | Page number (default: 1) |
| `page_size` | `integer` | Items per page (default: 20, max: 100) |

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "uuid",
      "amount": 42.50,
      "date": "2026-04-13",
      "establishment": "Supermercado Extra",
      "description": "Weekly groceries",
      "category_id": 1,
      "category_name": "Alimentação",
      "tax_id": "12.345.678/0001-99",
      "entry_type": "image",
      "transaction_type": "expense",
      "confidence": 0.97,
      "created_at": "2026-04-13T10:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "page_size": 20
}
```

---

## Get Transaction

```http
GET /api/v2/transactions/{id}
```

**Response `200 OK`:** Single transaction object (same shape as items above).

**Response `404 Not Found`:** Transaction does not exist.

---

## Create Transaction

```http
POST /api/v2/transactions
```

**Request Body:**
```json
{
  "amount": 42.50,
  "date": "2026-04-13",
  "establishment": "Supermercado Extra",
  "description": "Weekly groceries",
  "category_id": 1,
  "tax_id": "12.345.678/0001-99",
  "entry_type": "text",
  "transaction_type": "expense"
}
```

**Response `201 Created`:** Full transaction object with generated `id` and `created_at`.

---

## Update Transaction

```http
PUT /api/v2/transactions/{id}
```

**Request Body:** Same fields as Create (all optional — send only what changes).

**Response `200 OK`:** Updated transaction object.

**Response `404 Not Found`:** Transaction does not exist.

---

## Delete Transaction

```http
DELETE /api/v2/transactions/{id}
```

**Response `204 No Content`:** Transaction deleted.

**Response `404 Not Found`:** Transaction does not exist.
```

- [ ] **Step 4: Create `pages/api-reference/categories.md`**

```markdown
# Categories

Endpoints for managing expense categories.

---

## List Categories

```http
GET /api/v2/categories
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `active_only` | `boolean` | If `true`, returns only active categories (default: `false`) |

**Response `200 OK`:**
```json
[
  { "id": 1, "name": "Alimentação", "is_active": true, "created_at": "2026-01-01T00:00:00Z" },
  { "id": 2, "name": "Transporte", "is_active": true, "created_at": "2026-01-01T00:00:00Z" }
]
```

---

## Create Category

```http
POST /api/v2/categories
```

**Request Body:**
```json
{ "name": "Pets" }
```

**Response `201 Created`:**
```json
{ "id": 11, "name": "Pets", "is_active": true, "created_at": "2026-04-13T10:00:00Z" }
```

**Response `409 Conflict`:** Category name already exists.

---

## Update Category

```http
PATCH /api/v2/categories/{id}
```

**Request Body:**
```json
{ "name": "Animais de Estimação" }
```

**Response `200 OK`:** Updated category object.

**Response `404 Not Found`:** Category does not exist.

---

## Deactivate Category

```http
DELETE /api/v2/categories/{id}
```

Deactivates the category — does **not** hard-delete it. Expenses linked to this category are preserved.

**Response `204 No Content`:** Category deactivated.

**Response `404 Not Found`:** Category does not exist.
```

- [ ] **Step 5: Create `pages/api-reference/reports.md`**

```markdown
# Reports

Endpoints for financial summary and monthly breakdown reports.

---

## Summary Report

```http
GET /api/v2/reports/summary
```

Returns the total and category breakdown for a given period.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `start_date` | `YYYY-MM-DD` | Period start (default: first day of current month) |
| `end_date` | `YYYY-MM-DD` | Period end (default: today) |

**Response `200 OK`:**
```json
{
  "total": 1842.75,
  "transaction_count": 34,
  "period": {
    "start": "2026-04-01",
    "end": "2026-04-13"
  },
  "by_category": [
    { "category_id": 1, "category_name": "Alimentação", "total": 620.00, "count": 12 },
    { "category_id": 9, "category_name": "Transporte", "total": 310.50, "count": 8 }
  ]
}
```

---

## Monthly Report

```http
GET /api/v2/reports/monthly
```

Returns total expenses grouped by month for a given year.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `year` | `integer` | Year to report on (default: current year) |

**Response `200 OK`:**
```json
{
  "year": 2026,
  "months": [
    {
      "month": "2026-01",
      "total": 3200.00,
      "transaction_count": 45,
      "by_category": [
        { "category_id": 1, "category_name": "Alimentação", "total": 890.00 }
      ]
    }
  ]
}
```

Only months with at least one transaction are included in the response.
```

- [ ] **Step 6: Create `pages/api-reference/export.md`**

```markdown
# Export

Endpoint for exporting transactions as a CSV file.

---

## Export CSV

```http
GET /api/v2/export/csv
```

Returns a CSV file with all transactions for the requested period.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `start_date` | `YYYY-MM-DD` | Export from this date (default: first day of current month) |
| `end_date` | `YYYY-MM-DD` | Export to this date (default: today) |

**Response `200 OK`:**

```
Content-Type: text/csv
Content-Disposition: attachment; filename="expenses-2026-04.csv"
```

**CSV columns:**

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Transaction ID |
| `date` | YYYY-MM-DD | Transaction date |
| `establishment` | string | Merchant name |
| `description` | string | Description |
| `amount` | decimal | Amount in BRL |
| `category` | string | Category name |
| `entry_type` | string | `image`, `text`, or `pdf` |
| `confidence` | decimal | AI extraction confidence (0.00–1.00) |
| `created_at` | ISO 8601 | When the record was created |

**Example row:**
```csv
id,date,establishment,description,amount,category,entry_type,confidence,created_at
a1b2c3d4-...,2026-04-13,Supermercado Extra,Weekly groceries,42.50,Alimentação,image,0.97,2026-04-13T10:00:00Z
```
```

- [ ] **Step 7: Verify all API Reference pages in browser**

With `npm run dev` running, open:
- `http://localhost:3000/api-reference` — expect auth + error codes
- `http://localhost:3000/api-reference/transactions` — expect all 5 CRUD endpoints
- `http://localhost:3000/api-reference/categories` — expect all 4 endpoints
- `http://localhost:3000/api-reference/reports` — expect summary + monthly
- `http://localhost:3000/api-reference/export` — expect CSV export details

- [ ] **Step 8: Commit**

```bash
git add pages/api-reference/
git commit -m "docs: add API reference section (transactions, categories, reports, export)"
```

---

### Task 5: Create flat sections — Database, Security, Roadmap

**Files:**
- Create: `pages/database/index.md`
- Create: `pages/security/index.md`
- Create: `pages/roadmap/index.md`

- [ ] **Step 1: Create `pages/database/index.md`**

```markdown
# Database

The database is a Supabase-hosted PostgreSQL instance. All tables use Supabase's built-in Row Level Security (RLS) disabled for service-key access (single-user system).

---

## Table: `transactions`

Stores all expense and income records.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | No | Primary key, auto-generated |
| `amount` | `DECIMAL(10,2)` | No | Transaction amount in BRL |
| `date` | `DATE` | No | Transaction date |
| `establishment` | `VARCHAR` | Yes | Merchant or payee name |
| `description` | `VARCHAR` | Yes | Free-text description |
| `category_id` | `INT` | Yes | FK → `categories.id` |
| `tax_id` | `VARCHAR` | Yes | CNPJ or CPF of the merchant |
| `entry_type` | `VARCHAR` | No | `'image'`, `'text'`, or `'pdf'` |
| `transaction_type` | `VARCHAR` | No | `'expense'` or `'income'` |
| `confidence` | `DECIMAL(3,2)` | Yes | AI extraction confidence (0.00–1.00) |
| `raw_data` | `JSONB` | Yes | Full AI extraction output |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | Last update timestamp |

**Indexes:**

| Index | Columns | Purpose |
|---|---|---|
| `idx_transactions_date` | `date` | Filter/sort by date |
| `idx_transactions_category` | `category_id` | Filter by category |
| `idx_transactions_date_category` | `(date, category_id)` | Combined filter queries |

---

## Table: `categories`

Stores expense categories. Deactivating a category preserves all linked transactions.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` | No | Primary key, auto-increment |
| `name` | `VARCHAR` | No | Category name (unique) |
| `is_active` | `BOOLEAN` | No | Whether the category is active (default: `true`) |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |

**Constraint:** `UNIQUE(name)`

---

## Relationships

```
categories (id) ──< transactions (category_id)
```

`category_id` in `transactions` is nullable — a transaction can exist without a category.

---

## Default Categories

Seeded on first setup:

| Name |
|---|
| Alimentação |
| Educação |
| Lazer |
| Moradia |
| Outros |
| Pets |
| Saúde |
| Serviços |
| Transporte |
| Vestuário |
```

- [ ] **Step 2: Create `pages/security/index.md`**

```markdown
# Security

Security model for the Personal Finances system. Single-user, private use.

---

## Authentication

- **Provider:** Supabase Auth (email + password)
- **Session:** JWT stored in HTTP-only cookies via `@supabase/ssr`
- **User creation:** Only via seed script — no public registration endpoint
- **Token lifetime:** Managed by Supabase (auto-refresh via SSR middleware)

All frontend API calls include `Authorization: Bearer <jwt>` in the request header. The backend validates the JWT on every `/api/v2/*` request.

---

## Telegram Bot Access Control

| Control | Implementation |
|---|---|
| Webhook secret | `X-Telegram-Bot-Api-Secret-Token` header validated on every incoming update |
| Chat ID restriction | All messages from chat IDs other than `TELEGRAM_ALLOWED_CHAT_ID` are silently ignored |
| HTTPS only | Telegram Bot API requires HTTPS for webhook URLs |

---

## Backend Hardening

| Measure | Detail |
|---|---|
| OpenAPI hidden in production | `openapi_url=None` when `ENVIRONMENT=production` (default). Set `ENVIRONMENT=development` to expose `/openapi.json`. |
| Rate limiting | 30 req/min per IP on `/webhook` |
| CORS | Accepts only `*.nathanfiorito.com.br` origins |
| Service key isolation | Supabase service key used only in backend — never exposed to frontend |
| No hard deletes on categories | Deactivation preserves data integrity |

---

## Environment Variables (sensitive)

Never commit these values. Store in `.env` (local) and Render / Vercel environment settings (production).

| Variable | Used By | Secret Level |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Backend | High |
| `TELEGRAM_WEBHOOK_SECRET` | Backend | High |
| `TELEGRAM_ALLOWED_CHAT_ID` | Backend | Medium |
| `OPENROUTER_API_KEY` | Backend | High |
| `SUPABASE_URL` | Backend + Frontend | Low |
| `SUPABASE_SERVICE_KEY` | Backend only | High |
| `SUPABASE_ANON_KEY` | Frontend only | Low |
```

- [ ] **Step 3: Create `pages/roadmap/index.md`**

```markdown
# Roadmap

Development milestones and future plans for Personal Finances.

---

## Current Status

The system is live and in active use. Core features are complete.

---

## Completed

- [x] Telegram bot with image, PDF, and text receipt parsing
- [x] AI extraction with Claude Sonnet 4.6 (vision) and Haiku 4.5 (text)
- [x] AI categorization and duplicate detection
- [x] Mandatory confirmation before persisting expenses
- [x] REST API (hexagonal architecture) with Supabase Auth JWT
- [x] Next.js dashboard — expenses, reports, categories
- [x] Expense and income tracking (`transaction_type`)
- [x] CI/CD pipeline (GitHub Actions → Render + Vercel)
- [x] Monthly automated report via APScheduler
- [x] CSV export

---

## In Progress

- [ ] Frontend design system (Tailwind-based, mobile-responsive)
- [ ] Documentation site (`personal-finances-doc`)

---

## Planned

- [ ] Mobile-responsive frontend (spec written)
- [ ] Income tracking UI (spec written)
- [ ] Budget limits per category with alerts
- [ ] Recurring expense detection
- [ ] Annual summary report
- [ ] Dark mode
```

- [ ] **Step 4: Verify all flat section pages in browser**

With `npm run dev` running, open:
- `http://localhost:3000/database` — expect full schema tables
- `http://localhost:3000/security` — expect auth + hardening sections
- `http://localhost:3000/roadmap` — expect milestone checklist

- [ ] **Step 5: Commit**

```bash
git add pages/database/ pages/security/ pages/roadmap/
git commit -m "docs: add database, security, and roadmap sections"
```

---

### Task 6: Create public/ directory and final verification

**Files:**
- Create: `public/.gitkeep`

- [ ] **Step 1: Create `public/` placeholder**

```bash
touch public/.gitkeep
```

This keeps the `public/` directory in git for future diagrams and images.

- [ ] **Step 2: Run full build to verify no errors**

```bash
npm run build
```

Expected: Build completes with no errors. Output shows all routes:
```
Route (pages)
┌ ○ /
├ ○ /architecture
├ ○ /architecture/backend
├ ○ /architecture/frontend
├ ○ /architecture/telegram-bot
├ ○ /api-reference
├ ○ /api-reference/transactions
├ ○ /api-reference/categories
├ ○ /api-reference/reports
├ ○ /api-reference/export
├ ○ /database
├ ○ /security
└ ○ /roadmap
```

- [ ] **Step 3: Verify sidebar navigation**

Open `http://localhost:3000` and confirm:
- Sidebar shows all 5 top-level sections
- Architecture and API Reference expand to show sub-pages
- All links navigate correctly with no 404s

- [ ] **Step 4: Final commit**

```bash
git add public/
git commit -m "chore: add public directory placeholder; documentation site complete"
```
