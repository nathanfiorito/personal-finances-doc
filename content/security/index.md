# Security

Security model for the Personal Finances system. Single-user, private use.

---

## Authentication

- **Provider:** Spring Security + JWT (JJWT 0.12.6)
- **Session:** Stateless — no server-side session. The JWT is sent as `Authorization: Bearer <jwt>` on every request.
- **Login:** `POST /api/auth/login` with `{ "email": "...", "password": "..." }`. Returns a signed JWT.
- **Token lifetime:** 7 days (604 800 seconds). Configured via `jwt.expiration-seconds`.
- **Credential storage:** Admin email and BCrypt password hash are set via environment variables (`APP_ADMIN_EMAIL`, `APP_ADMIN_PASSWORD_HASH`). No registration endpoint — user is provisioned at deploy time.

All frontend API calls include `Authorization: Bearer <jwt>` in the request header. The backend validates the JWT signature and expiration on every `/api/v1/*` request via `JwtAuthFilter`.

---

## Telegram Bot Access Control

| Control | Implementation |
|---|---|
| Webhook secret | `X-Telegram-Bot-Api-Secret-Token` header validated on every incoming update via `TelegramWebhookFilter` |
| Chat ID restriction | All messages from chat IDs other than `TELEGRAM_ALLOWED_CHAT_ID` are silently ignored |
| HTTPS only | Telegram Bot API requires HTTPS for webhook URLs |

---

## Backend Hardening

| Measure | Detail |
|---|---|
| Stateless JWT | No session store; each request is independently authenticated |
| BCrypt passwords | Admin password hash stored with BCrypt (not plaintext) |
| CSRF disabled | Stateless API — no CSRF token needed |
| CORS | Accepts only origins in `CORS_ALLOWED_ORIGINS` (comma-separated). Defaults to `http://localhost:3000` in development. |
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
| `DB_URL` | Backend | High |
| `DB_USERNAME` | Backend | High |
| `DB_PASSWORD` | Backend | High |
| `JWT_SECRET` | Backend | High |
| `APP_ADMIN_EMAIL` | Backend | Medium |
| `APP_ADMIN_PASSWORD_HASH` | Backend | High |
| `CORS_ALLOWED_ORIGINS` | Backend | Low |
