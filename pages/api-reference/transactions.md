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
