# Export

Endpoint for exporting transactions as a CSV file.

---

## Export CSV

```http
GET /api/v1/export/csv
```

Returns a CSV file with all transactions for the requested date range. Both parameters are required.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `start` | `YYYY-MM-DD` | Yes | Export from this date (inclusive) |
| `end` | `YYYY-MM-DD` | Yes | Export to this date (inclusive) |

**Response `200 OK`:**

```
Content-Type: text/csv; charset=UTF-8
Content-Disposition: attachment; filename="transactions_{start}_{end}.csv"
```

Example filename: `transactions_2026-04-01_2026-04-30.csv`

**CSV columns (in order):**

| Column | Type | Description |
|---|---|---|
| `date` | YYYY-MM-DD | Transaction date |
| `amount` | decimal | Amount in BRL |
| `establishment` | string | Merchant name |
| `category` | string | Category name |
| `description` | string | Free-text description |
| `tax_id` | string | CNPJ/CPF of the merchant |
| `entry_type` | string | `image`, `text`, `pdf`, or `manual` |
| `transaction_type` | string | `EXPENSE` or `INCOME` |

The file is UTF-8 encoded with a BOM (`\uFEFF`) so it opens correctly in Excel.

**Example row:**
```csv
date,amount,establishment,category,description,tax_id,entry_type,transaction_type
2026-04-13,42.50,Supermercado Extra,Alimentação,Weekly groceries,12.345.678/0001-99,image,EXPENSE
```
