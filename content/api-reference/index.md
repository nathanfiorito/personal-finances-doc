# API Reference

REST API for the Personal Finances frontend. All protected endpoints are under `/api/v1/`.

## Base URL

```
Production: https://<your-vps-host>   (Hostinger VPS behind Coolify reverse proxy)
Development: http://localhost:8080
```

## Authentication

Protected routes require a JWT obtained from the login endpoint:

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secret" }
```

Response `200 OK`:
```json
{ "token": "<jwt>", "expiration_seconds": 604800 }
```

Include the token in every subsequent request:

```http
Authorization: Bearer <jwt>
```

Token lifetime is 7 days (604 800 s). The `/api/auth/**` and `/webhook` routes are public. All `/api/v1/*` routes require a valid JWT.

## Error Response Format

All errors return a standardised JSON envelope handled by `GlobalExceptionHandler`:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "amount is required, category_id is required",
  "timestamp": "2026-04-16T10:30:00",
  "details": {
    "amount": "amount is required",
    "category_id": "category_id is required"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `status` | `int` | HTTP status code |
| `error` | `string` | HTTP reason phrase |
| `message` | `string` | Human-readable summary |
| `timestamp` | `string` | ISO 8601 timestamp of the error |
| `details` | `map<string, string>` | Field-level errors (only present for validation failures; omitted otherwise) |

## Common Error Codes

| Code | Situation |
|---|---|
| `400 Bad Request` | Malformed body, missing/invalid params, validation failure |
| `401 Unauthorized` | Missing, malformed, or invalid JWT |
| `403 Forbidden` | Webhook secret token mismatch or access denied |
| `404 Not Found` | Resource does not exist or unknown route |
| `405 Method Not Allowed` | Wrong HTTP method for the endpoint |
| `409 Conflict` | Database constraint violation (e.g. duplicate name) |
| `415 Unsupported Media Type` | Request Content-Type not supported |
| `500 Internal Server Error` | Unexpected server error |

## CORS

Accepts origins listed in `CORS_ALLOWED_ORIGINS` (comma-separated, default `http://localhost:3000`).
Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`. Credentials are allowed.

## JSON Conventions

All API responses use **snake_case** field names (Jackson `SNAKE_CASE` naming strategy).
Enum values (`transaction_type`, `payment_method`, `entry_type`) are serialised as lowercase strings.
Dates are ISO 8601 strings (`YYYY-MM-DD` for `LocalDate`, full timestamp for `LocalDateTime`).
`null` fields are omitted from responses (`NON_NULL` inclusion).
