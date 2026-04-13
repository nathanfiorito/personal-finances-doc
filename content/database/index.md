# Database

Supabase-hosted PostgreSQL instance. RLS is enabled on both tables with a `"service role full access"` policy that grants full access to the backend service key.

---

## Table: `transactions`

Stores all expense and income records.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | No | Primary key, auto-generated (`gen_random_uuid()`) |
| `amount` | `DECIMAL(10,2)` | No | Transaction amount in BRL |
| `date` | `DATE` | No | Transaction date |
| `establishment` | `VARCHAR(255)` | Yes | Merchant or payee name |
| `description` | `TEXT` | Yes | Free-text description |
| `category_id` | `INT` | No | FK → `categories.id` |
| `tax_id` | `VARCHAR(18)` | Yes | CNPJ or CPF of the merchant |
| `entry_type` | `VARCHAR(20)` | No | `'imagem'`, `'texto'`, or `'pdf'` — stored in Portuguese per DB constraint |
| `transaction_type` | `VARCHAR(10)` | No | `'income'` or `'expense'` (default: `'outcome'` in schema, renamed to `'expense'` via migration) |
| `confidence` | `DECIMAL(3,2)` | Yes | AI extraction confidence (0.00–1.00) |
| `raw_data` | `JSONB` | No | Full AI extraction output (default: `{}`) |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | Last update timestamp |

**Indexes:**

| Index | Columns | Purpose |
|---|---|---|
| `idx_transactions_date` | `date` | Filter/sort by date |
| `idx_transactions_category_id` | `category_id` | Filter by category |
| `idx_transactions_date_category_id` | `(date, category_id)` | Combined date + category queries |
| `idx_transactions_transaction_type` | `transaction_type` | Filter by income vs expense |

> **Note:** The `payment_method` field (`'credit'` | `'debit'`) exists in the API layer (domain entity and endpoints) but is not yet reflected in the `supabase_schema.sql` file. It may be stored in `raw_data` or added via a pending migration.

---

## Table: `categories`

Stores expense categories. Deactivating a category preserves all linked transactions.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` | No | Primary key, auto-increment |
| `name` | `VARCHAR(100)` | No | Category name (unique) |
| `is_active` | `BOOLEAN` | No | Whether the category is active (default: `true`) |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |

**Constraint:** `UNIQUE(name)`

---

## Relationships

```
categories (id) ──< transactions (category_id)
```

`category_id` in `transactions` is `NOT NULL` — every transaction must have a category.

---

## Default Categories

Seeded on first setup:

| Name |
|---|
| Alimentação |
| Educação |
| Lazer |
| Moradia |
| Outros |
| Pets |
| Saúde |
| Serviços |
| Transporte |
| Vestuário |
