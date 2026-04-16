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
| `card_id` | `INT` | Yes | FK → `credit_cards.id`. Required when `payment_method = 'CREDIT'` |
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
| `idx_transactions_card_id` | `card_id` | Filter by card |

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

## Table: `credit_cards`

Stores registered credit cards for invoice tracking.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` | No | Primary key, auto-increment |
| `alias` | `VARCHAR(100)` | No | User-defined name |
| `bank` | `VARCHAR(100)` | No | Bank name |
| `last_four_digits` | `CHAR(4)` | No | Last 4 digits of card number |
| `closing_day` | `SMALLINT` | No | Invoice closing day (1–31) |
| `due_day` | `SMALLINT` | No | Invoice due day (1–31) |
| `active` | `BOOLEAN` | No | Soft delete flag (default: `true`) |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | Last update timestamp |

**Index:** `idx_credit_cards_active` on `active`.

---

## Table: `invoice_predictions`

Caches AI-generated spending predictions per card per billing cycle.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `SERIAL` | No | Primary key, auto-increment |
| `card_id` | `INT` | No | FK → `credit_cards.id` |
| `invoice_month` | `DATE` | No | First day of the closing month |
| `predicted_total` | `DECIMAL(10,2)` | No | Predicted final invoice total |
| `prediction_data` | `JSONB` | Yes | Raw prediction details |
| `generated_at` | `TIMESTAMPTZ` | No | When prediction was generated |
| `created_at` | `TIMESTAMPTZ` | No | Record creation timestamp |

**Constraint:** `UNIQUE(card_id, invoice_month)` — one prediction per card per cycle.

---

## Relationships

```
categories (id)      ──< transactions (category_id)
credit_cards (id)    ──< transactions (card_id)
credit_cards (id)    ──< invoice_predictions (card_id)
```

`category_id` in `transactions` is `NOT NULL` — every transaction must have a category.

> **Constraint:** `chk_card_id_credit` — if `payment_method = 'CREDIT'` then `card_id` must not be null; if `payment_method != 'CREDIT'` then `card_id` must be null.

---

## Migrations

Flyway manages schema versions. Migration files live at:

```
app/src/main/resources/db/migration/
├── V1__init.sql                          — initial schema: categories + transactions tables + indexes
├── V2__confidence_to_double.sql          — ALTER COLUMN confidence from DECIMAL(4,2) to DOUBLE PRECISION
├── V3__create_credit_cards.sql           — credit_cards table + active index
├── V4__add_card_id_to_transactions.sql   — card_id FK + CHECK constraint + index
└── V5__create_invoice_predictions.sql    — invoice_predictions table + unique constraint
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
