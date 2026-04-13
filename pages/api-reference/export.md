# Export

Endpoint for exporting transactions as a CSV file.

---

## Export CSV

```http
GET /api/v2/export/csv
```

Returns a CSV file with all transactions for the requested period.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `start_date` | `YYYY-MM-DD` | Export from this date (default: first day of current month) |
| `end_date` | `YYYY-MM-DD` | Export to this date (default: today) |

**Response `200 OK`:**

```
Content-Type: text/csv
Content-Disposition: attachment; filename="expenses-2026-04.csv"
```

**CSV columns:**

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Transaction ID |
| `date` | YYYY-MM-DD | Transaction date |
| `establishment` | string | Merchant name |
| `description` | string | Description |
| `amount` | decimal | Amount in BRL |
| `category` | string | Category name |
| `entry_type` | string | `image`, `text`, or `pdf` |
| `confidence` | decimal | AI extraction confidence (0.00–1.00) |
| `created_at` | ISO 8601 | When the record was created |

**Example row:**
```csv
id,date,establishment,description,amount,category,entry_type,confidence,created_at
a1b2c3d4-...,2026-04-13,Supermercado Extra,Weekly groceries,42.50,Alimentação,image,0.97,2026-04-13T10:00:00Z
```
