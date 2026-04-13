# Reports

Endpoints for financial summary and monthly breakdown reports.

---

## Summary Report

```http
GET /api/v2/reports/summary
```

Returns the total and category breakdown for a given period.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `start_date` | `YYYY-MM-DD` | Period start (default: first day of current month) |
| `end_date` | `YYYY-MM-DD` | Period end (default: today) |

**Response `200 OK`:**
```json
{
  "total": 1842.75,
  "transaction_count": 34,
  "period": {
    "start": "2026-04-01",
    "end": "2026-04-13"
  },
  "by_category": [
    { "category_id": 1, "category_name": "Alimentação", "total": 620.00, "count": 12 },
    { "category_id": 9, "category_name": "Transporte", "total": 310.50, "count": 8 }
  ]
}
```

---

## Monthly Report

```http
GET /api/v2/reports/monthly
```

Returns total expenses grouped by month for a given year.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `year` | `integer` | Year to report on (default: current year) |

**Response `200 OK`:**
```json
{
  "year": 2026,
  "months": [
    {
      "month": "2026-01",
      "total": 3200.00,
      "transaction_count": 45,
      "by_category": [
        { "category_id": 1, "category_name": "Alimentação", "total": 890.00 }
      ]
    }
  ]
}
```

Only months with at least one transaction are included in the response.
