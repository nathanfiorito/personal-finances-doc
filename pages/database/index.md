# Database

Supabase-hosted PostgreSQL instance. All access uses the Supabase service key — Row Level Security (RLS) is disabled for service-key access (single-user system).

---

## Table: `transactions`

Stores all expense and income records.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | No | Primary key, auto-generated |
| `amount` | `DECIMAL(10,2)` | No | Transaction amount in BRL |
| `date` | `DATE` | No | Transaction date |
| `establishment` | `VARCHAR` | Yes | Merchant or payee name |
| `description` | `VARCHAR` | Yes | Free-text description |
| `category_id` | `INT` | Yes | FK → `categories.id` |
| `tax_id` | `VARCHAR` | Yes | CNPJ or CPF of the merchant |
| `entry_type` | `VARCHAR` | No | `'image'`, `'text'`, or `'pdf'` |
| `transaction_type` | `VARCHAR` | No | `'expense'` or `'income'` |
| `confidence` | `DECIMAL(3,2)` | Yes | AI extraction confidence (0.00–1.00) |
| `raw_data` | `JSONB` | Yes | Full AI extraction output |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | Last update timestamp |

**Indexes:**

| Index | Columns | Purpose |
|---|---|---|
| `idx_transactions_date` | `date` | Filter/sort by date |
| `idx_transactions_category` | `category_id` | Filter by category |
| `idx_transactions_date_category` | `(date, category_id)` | Combined filter queries |

---

## Table: `categories`

Stores expense categories. Deactivating a category preserves all linked transactions.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` | No | Primary key, auto-increment |
| `name` | `VARCHAR` | No | Category name (unique) |
| `is_active` | `BOOLEAN` | No | Whether the category is active (default: `true`) |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |

**Constraint:** `UNIQUE(name)`

---

## Relationships

```
categories (id) ──< transactions (category_id)
```

`category_id` in `transactions` is nullable — a transaction can exist without a category.

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
