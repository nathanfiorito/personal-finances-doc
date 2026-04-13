# Reports

Endpoints for monthly expense/income breakdown.

---

## Monthly Report

```http
GET /api/v2/reports/monthly
```

Returns totals grouped by month for a given year.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `year` | `integer` | Yes | Year to report on |
| `transaction_type` | `"income" \| "expense"` | No | Filter by type |

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
