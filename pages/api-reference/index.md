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
