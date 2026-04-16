# Cards

Endpoints for managing credit cards and tracking invoices.

---

## List Cards

```http
GET /api/v1/cards
```

Returns all active credit cards.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "alias": "Nubank pessoal",
    "bank": "Nubank",
    "last_four_digits": "4532",
    "closing_day": 15,
    "due_day": 25,
    "is_active": true
  }
]
```

---

## Get Card

```http
GET /api/v1/cards/{id}
```

**Response `200 OK`:** Single card object.

**Response `404 Not Found`:** Card does not exist.

---

## Create Card

```http
POST /api/v1/cards
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `alias` | `string` | Yes | User-defined name (max 100 chars) |
| `bank` | `string` | Yes | Bank name (max 100 chars) |
| `last_four_digits` | `string` | Yes | Exactly 4 digits |
| `closing_day` | `integer` | Yes | Invoice closing day (1–31) |
| `due_day` | `integer` | Yes | Invoice due day (1–31) |

**Response `201 Created`:** Full card object.

---

## Update Card

```http
PUT /api/v1/cards/{id}
```

**Request Body:** Same fields as Create, all required.

**Response `200 OK`:** Updated card object.

**Response `404 Not Found`:** Card does not exist.

---

## Deactivate Card

```http
DELETE /api/v1/cards/{id}
```

Soft-deletes the card (sets `active = false`). Existing transactions remain linked.

**Response `204 No Content`:** Card deactivated.

**Response `404 Not Found`:** Card does not exist.

---

## Current Invoice

```http
GET /api/v1/cards/{id}/invoices/current
```

Returns the current open invoice for a card, including all linked transactions in the billing period.

**Response `200 OK`:**
```json
{
  "card_id": 1,
  "period_start": "2026-03-16",
  "period_end": "2026-04-15",
  "closing_date": "2026-04-15",
  "due_date": "2026-04-25",
  "total": "1250.00",
  "transactions": [
    {
      "id": "uuid",
      "amount": "150.00",
      "date": "2026-04-01",
      "establishment": "Supermercado Extra",
      "description": null,
      "category": "Alimentação",
      "category_id": 1
    }
  ]
}
```

---

## Historical Invoice

```http
GET /api/v1/cards/{id}/invoices/{year}/{month}
```

Returns a specific past invoice. The `year` and `month` refer to when the invoice closes (e.g., `2026/3` for the invoice closing in March 2026).

**Response `200 OK`:** Same shape as current invoice.

---

## Invoice Timeline

```http
GET /api/v1/cards/{id}/invoices/timeline
```

Returns daily accumulated spending data for the current and previous invoice periods. Used by the frontend chart.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `months` | `integer` | Number of periods (default: 1, max: 12) |

**Response `200 OK`:**
```json
{
  "current": {
    "closing_date": "2026-04-15",
    "due_date": "2026-04-25",
    "total": "1250.00",
    "daily": [
      { "date": "2026-03-16", "amount": "150.00", "accumulated": "150.00" },
      { "date": "2026-03-17", "amount": "80.00", "accumulated": "230.00" }
    ]
  },
  "previous": {
    "closing_date": "2026-03-15",
    "due_date": "2026-03-25",
    "total": "2100.00",
    "daily": [...]
  }
}
```

---

## Invoice Prediction

```http
GET /api/v1/cards/{id}/invoices/prediction
```

Returns an AI-powered prediction of the final invoice total for the current billing cycle. Predictions are cached for 24 hours.

**Response `200 OK`:**
```json
{
  "predicted_total": "2800.00",
  "current_total": "1250.00",
  "days_remaining": 14,
  "daily_average": "89.28",
  "generated_at": "2026-04-16T10:00:00",
  "confidence": "medium",
  "projected_remaining": "1550.00",
  "based_on_invoices": 3
}
```

**Response `204 No Content`:** Not enough historical data (fewer than 2 closed invoices).

---

## Force Refresh Prediction

```http
POST /api/v1/cards/{id}/invoices/prediction/refresh
```

Regenerates the prediction regardless of cache age. Returns the new prediction.

**Response `200 OK`:** Same shape as prediction above.

**Response `204 No Content`:** Not enough historical data.
