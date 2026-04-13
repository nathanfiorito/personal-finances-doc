# Categories

Endpoints for managing expense categories.

---

## List Categories

```http
GET /api/v2/categories
```

Returns all categories (active and inactive).

**Response `200 OK`:**
```json
[
  { "id": 1, "name": "Alimentação", "is_active": true },
  { "id": 2, "name": "Transporte", "is_active": true }
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
{ "id": 11, "name": "Pets", "is_active": true }
```

---

## Update Category

```http
PATCH /api/v2/categories/{id}
```

Both fields are optional — send only what changes.

**Request Body:**
```json
{ "name": "Animais de Estimação", "is_active": true }
```

**Response `200 OK`:** Updated category object.

**Response `404 Not Found`:** Category does not exist.

---

## Deactivate Category

```http
DELETE /api/v2/categories/{id}
```

Deactivates the category — does **not** hard-delete it. Transactions linked to this category are preserved.

**Response `204 No Content`:** Category deactivated.

**Response `404 Not Found`:** Category does not exist.
