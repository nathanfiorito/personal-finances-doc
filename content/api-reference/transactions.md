# Transactions

Endpoints for managing transactions.

---

## List Transactions

```http
GET /api/v2/bff/expenses
```

Returns a paginated list of transactions alongside all active categories (used by the expenses page).

**Query Parameters (all optional):**

| Parameter | Type | Description |
|---|---|---|
| `start` | `YYYY-MM-DD` | Filter from this date (inclusive) |
| `end` | `YYYY-MM-DD` | Filter to this date (inclusive) |
| `category_id` | `integer` | Filter by category |
| `transaction_type` | `"income" \| "expense"` | Filter by type |
| `page` | `integer` | Page number (default: 1) |
| `page_size` | `integer` | Items per page (default: 20, max: 100) |

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
    "page": 1,
    "page_size": 20
  },
  "categories": [
    { "id": 1, "name": "Alimentação", "is_active": true }
  ]
}
```

---

## Create Transaction

```http
POST /api/v2/transactions
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `amount` | `decimal` | Yes | Positive value, max 999999.99 |
| `category_id` | `integer` | Yes | Must reference an existing category |
| `payment_method` | `"credit" \| "debit"` | Yes | Payment method |
| `date` | `YYYY-MM-DD` | No | Defaults to today if omitted |
| `transaction_type` | `"income" \| "expense"` | No | Default: `"expense"` |
| `entry_type` | `string` | No | Default: `"text"` |
| `establishment` | `string` | No | Merchant name |
| `description` | `string` | No | Free-text description |
| `tax_id` | `string` | No | CNPJ/CPF |

**Response `201 Created`:** Full `Expense` object (see response shape in List Transactions above).

---

## Update Transaction

```http
PUT /api/v2/transactions/{id}
```

All fields are optional — send only what changes.

**Request Body:** Same fields as Create, all optional.

**Response `200 OK`:** Updated `Expense` object.

**Response `404 Not Found`:** Transaction does not exist.

---

## Delete Transaction

```http
DELETE /api/v2/transactions/{id}
```

**Response `204 No Content`:** Transaction deleted.

**Response `404 Not Found`:** Transaction does not exist.
