# Reports

Endpoints for expense/income summaries and monthly breakdowns.

---

## Summary Report

```http
GET /api/v1/reports/summary
```

Returns totals grouped by category for a given date range, sorted by category name.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `start` | `YYYY-MM-DD` | Yes | Start date (inclusive) |
| `end` | `YYYY-MM-DD` | Yes | End date (inclusive) |
| `type` | `"EXPENSE" \| "INCOME"` | No | Filter by transaction type (case-insensitive) |

**Response `200 OK`:**

```json
[
  { "category": "Alimentação", "total": 620.00, "count": 8 },
  { "category": "Transporte",  "total": 310.50, "count": 3 }
]
```

**Field notes:**
- `category` — category name string
- `total` — total amount (decimal number)
- `count` — number of transactions in this category for the period

---

## Monthly Report

```http
GET /api/v1/reports/monthly
```

Returns totals grouped by month for a given year, broken down by category within each month.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `year` | `integer` | Yes | Year to report on (e.g. `2026`) |

**Response `200 OK`:**

An array of monthly items — only months with at least one transaction are included.

```json
[
  {
    "month": 4,
    "total": 1842.75,
    "by_category": [
      { "category": "Alimentação", "total": 620.00 },
      { "category": "Transporte",  "total": 310.50 }
    ]
  }
]
```

**Field notes:**
- `month` — integer month number (1–12)
- `total` — total amount for the month (decimal number)
- `by_category[].category` — category name string
- `by_category[].total` — category total for the month (decimal number)
