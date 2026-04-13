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
