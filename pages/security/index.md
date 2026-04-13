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
