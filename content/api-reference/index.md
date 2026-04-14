# API Reference

REST API for the Personal Finances frontend. All protected endpoints are under `/api/v1/`.

## Base URL

```
Production: https://personal-finances-backend.onrender.com
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
{ "token": "<jwt>", "expires_in": 604800 }
```

Include the token in every subsequent request:

```http
Authorization: Bearer <jwt>
```

The `/api/auth/**` and `/webhook` routes are public. All `/api/v1/*` routes require a valid JWT.

## Common Error Codes

| Code | Situation |
|---|---|
| `401 Unauthorized` | Header missing, malformed, or invalid token |
| `403 Forbidden` | Token expired or insufficient permissions |
| `404 Not Found` | Resource does not exist |
| `422 Unprocessable Entity` | Validation error — check request body |
| `500 Internal Server Error` | Unexpected server error |

## CORS

Accepts origins configured in `CORS_ALLOWED_ORIGINS` (defaults to `http://localhost:3000`) with methods `GET, POST, PUT, PATCH, DELETE, OPTIONS`.

## Health Check

```http
GET /health
```

Response `200 OK`:
```json
{ "status": "ok" }
```

No authentication required.
