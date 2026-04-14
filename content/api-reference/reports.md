# Reports

Endpoints for expense/income summaries and monthly breakdowns.

---

## Summary Report

```http
GET /api/v1/reports/summary
```

Returns totals grouped by category for a given date range.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `start` | `YYYY-MM-DD` | Yes | Start date (inclusive) |
| `end` | `YYYY-MM-DD` | Yes | End date (inclusive) |
| `type` | `"EXPENSE" \| "INCOME"` | No | Filter by transaction type |

**Response `200 OK`:**

```json
[
  { "category": "Alimentação", "total": "620.00" },
  { "category": "Transporte", "total": "310.50" }
]
```

---

## Monthly Report

```http
GET /api/v1/reports/monthly
```

Returns totals grouped by month for a given year.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `year` | `integer` | Yes | Year to report on |

**Response `200 OK`:**

An array of monthly items — only months with at least one transaction are included.

```json
[
  {
    "month": 4,
    "total": "1842.75",
    "by_category": [
      { "category": "Alimentação", "total": "620.00" },
      { "category": "Transporte", "total": "310.50" }
    ]
  }
]
```

**Field notes:**
- `month` — integer month number (1–12)
- `total` — serialized decimal string
- `by_category[].category` — category name string
- `by_category[].total` — serialized decimal string
