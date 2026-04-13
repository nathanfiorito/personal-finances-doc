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
