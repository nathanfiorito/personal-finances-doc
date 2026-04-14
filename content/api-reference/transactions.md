# Transactions

Endpoints for managing transactions.

---

## BFF — List Transactions + Categories

```http
GET /api/v1/bff/transactions
```

Returns a paginated list of transactions alongside all active categories. Used by the expenses page to populate both the transaction list and the category filter.

**Query Parameters (all optional):**

| Parameter | Type | Description |
|---|---|---|
| `page` | `integer` | Page number, zero-based (default: 0) |
| `page_size` | `integer` | Items per page (default: 20) |

**Response `200 OK`:**
```json
{
  "transactions": {
    "items": [
      {
        "id": "uuid",
        "amount": "42.50",
        "date": "2026-04-13",
        "establishment": "Supermercado Extra",
        "description": "Weekly groceries",
        "category_id": 1,
        "category": "Alimentação",
        "tax_id": "12.345.678/0001-99",
        "entry_type": "image",
        "transaction_type": "expense",
        "payment_method": "debit",
        "confidence": 0.97,
        "created_at": "2026-04-13T10:00:00Z"
      }
    ],
    "total": 42,
    "page": 0,
    "page_size": 20
  },
  "categories": [
    { "id": 1, "name": "Alimentação", "is_active": true }
  ]
}
```

---

## List Transactions

```http
GET /api/v1/transactions
```

Returns a paginated list of transactions.

**Query Parameters (all optional):**

| Parameter | Type | Description |
|---|---|---|
| `page` | `integer` | Page number, zero-based (default: 0) |
| `page_size` | `integer` | Items per page (default: 20) |

**Response `200 OK`:** Paginated list of transaction objects (same shape as BFF items above).

---

## Get Transaction

```http
GET /api/v1/transactions/{id}
```

**Response `200 OK`:** Single transaction object.

**Response `404 Not Found`:** Transaction does not exist.

---

## Create Transaction

```http
POST /api/v1/transactions
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `amount` | `decimal` | Yes | Positive value, max 999999.99 |
| `category_id` | `integer` | Yes | Must reference an existing category |
| `payment_method` | `"credit" \| "debit"` | Yes | Payment method |
| `date` | `YYYY-MM-DD` | No | Defaults to today if omitted |
| `transaction_type` | `"expense" \| "income"` | No | Default: `"expense"` |
| `entry_type` | `string` | No | Default: `"text"` |
| `establishment` | `string` | No | Merchant name |
| `description` | `string` | No | Free-text description (max 500 chars) |
| `tax_id` | `string` | No | CNPJ/CPF |

**Response `201 Created`:** Full transaction object.

---

## Update Transaction

```http
PUT /api/v1/transactions/{id}
```

All fields are optional — send only what changes.

**Request Body:** Same fields as Create, all optional.

**Response `200 OK`:** Updated transaction object.

**Response `404 Not Found`:** Transaction does not exist.

---

## Delete Transaction

```http
DELETE /api/v1/transactions/{id}
```

**Response `204 No Content`:** Transaction deleted.

**Response `404 Not Found`:** Transaction does not exist.
