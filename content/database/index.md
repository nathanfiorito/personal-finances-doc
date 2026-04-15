# Database

Self-hosted PostgreSQL instance. Schema is managed via Flyway migrations (`db/migration/`). No RLS — access control is enforced at the application layer by Spring Security.

---

## Table: `transactions`

Stores all expense and income records.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | No | Primary key, auto-generated (`gen_random_uuid()`) |
| `amount` | `DECIMAL(10,2)` | No | Transaction amount in BRL |
| `date` | `DATE` | No | Transaction date |
| `establishment` | `VARCHAR(255)` | Yes | Merchant or payee name |
| `description` | `VARCHAR(500)` | Yes | Free-text description |
| `category_id` | `INT` | No | FK → `categories.id` |
| `tax_id` | `VARCHAR(20)` | Yes | CNPJ or CPF of the merchant (formatted `XX.XXX.XXX/XXXX-XX` for 14-digit CNPJs) |
| `entry_type` | `VARCHAR(20)` | No | `'image'`, `'text'`, `'pdf'`, or `'manual'` |
| `transaction_type` | `VARCHAR(10)` | No | `'EXPENSE'` or `'INCOME'` |
| `payment_method` | `VARCHAR(10)` | Yes | `'CREDIT'` or `'DEBIT'` |
| `confidence` | `DOUBLE PRECISION` | Yes | AI extraction confidence (0.0–1.0) |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | Last update timestamp |

> **Note:** `transaction_type` and `payment_method` are stored uppercase in the DB (`'EXPENSE'`, `'CREDIT'`) but returned lowercase by the API (`"expense"`, `"credit"`).

> **Note:** `confidence` was originally `DECIMAL(4,2)` and was migrated to `DOUBLE PRECISION` in V2.

**Indexes:**

| Index | Columns | Purpose |
|---|---|---|
| `idx_transactions_date` | `date` | Filter/sort by date |
| `idx_transactions_category_id` | `category_id` | Filter by category |
| `idx_transactions_date_category_id` | `(date, category_id)` | Combined date + category queries |
| `idx_transactions_transaction_type` | `transaction_type` | Filter by income vs expense |

---

## Table: `categories`

Stores expense categories. Deactivating a category preserves all linked transactions.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` | No | Primary key, auto-increment |
| `name` | `VARCHAR(100)` | No | Category name (unique) |
| `active` | `BOOLEAN` | No | Whether the category is active (default: `true`) |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | Last update timestamp |

**Constraint:** `UNIQUE(name)`

---

## Relationships

```
categories (id) ──< transactions (category_id)
```

`category_id` in `transactions` is `NOT NULL` — every transaction must have a category.

---

## Migrations

Flyway manages schema versions. Migration files live at:

```
app/src/main/resources/db/migration/
├── V1__init.sql                  — initial schema: categories + transactions tables + indexes
└── V2__confidence_to_double.sql  — ALTER COLUMN confidence from DECIMAL(4,2) to DOUBLE PRECISION
```

New migrations follow the naming convention `V{N}__{description}.sql`. Flyway runs automatically on application startup (`spring.flyway.locations=classpath:db/migration`). The JPA DDL setting is `validate` — Flyway owns the schema; Hibernate never modifies it.

---

## Default Categories

Seeded on first setup (not managed by Flyway — insert manually or via the API):

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
