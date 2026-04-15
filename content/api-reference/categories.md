# Categories

Endpoints for managing expense categories.

---

## List Categories

```http
GET /api/v1/categories
```

Returns all **active** categories. Inactive (deactivated) categories are excluded.

**Response `200 OK`:**
```json
[
  { "id": 1, "name": "Alimentação", "active": true },
  { "id": 2, "name": "Transporte", "active": true }
]
```

---

## Create Category

```http
POST /api/v1/categories
```

**Request Body:**
```json
{ "name": "Pets" }
```

**Response `201 Created`:**
```json
{ "id": 11, "name": "Pets", "active": true }
```

---

## Update Category

```http
PATCH /api/v1/categories/{id}
```

Updates the category name.

**Request Body:**
```json
{ "name": "Animais de Estimação" }
```

**Response `200 OK`:** Updated category object.

**Response `404 Not Found`:** Category does not exist.

---

## Deactivate Category

```http
DELETE /api/v1/categories/{id}
```

Soft-deactivates the category — does **not** hard-delete it. All transactions linked to this category are preserved with their `category_id` intact.

**Response `204 No Content`:** Category deactivated.

**Response `404 Not Found`:** Category does not exist.
