# Backend Architecture

The backend is a Python/FastAPI application following the hexagonal (ports & adapters) pattern. All business logic lives in the domain layer with zero framework or database imports.

## Hexagonal Layers

```
Primary Adapters (BFF, Telegram) → Domain (Use Cases + Ports) ← Secondary Adapters (Supabase, OpenRouter, etc.)
```

| Layer | Location | Responsibility |
|---|---|---|
| Domain Entities | `src/v2/domain/entities/` | Pure data types — `Expense`, `Category` |
| Domain Exceptions | `src/v2/domain/exceptions.py` | `ExpenseNotFoundError`, etc. |
| Domain Ports | `src/v2/domain/ports/` | Abstract interfaces for all external dependencies |
| Domain Use Cases | `src/v2/domain/use_cases/` | All business logic — no framework or DB imports |
| Secondary Adapters | `src/v2/adapters/secondary/` | Supabase repos, OpenRouter LLM, Telegram notifier, in-memory pending state |
| Primary Adapters | `src/v2/adapters/primary/` | BFF REST router (`/api/v2/...`) + Telegram webhook handler |
| Bootstrap | `src/v2/bootstrap.py` | Wires all adapters into use cases; builds the FastAPI router |

## Package Layout

```
src/
├── config/settings.py          — Pydantic settings (env vars)
├── main.py                     — FastAPI app + lifespan + webhook endpoint
├── scheduler/reports.py        — APScheduler: monthly auto-report (1st of month, 08:00 BRT)
└── services/
    ├── llm.py                  — OpenRouter HTTP client with retry + tracing
    ├── telegram.py             — Telegram Bot API helpers
    └── tracing.py              — OpenTelemetry span helpers

src/v2/
├── bootstrap.py
├── domain/
│   ├── entities/               — Expense, Category (dataclasses)
│   ├── exceptions.py
│   ├── ports/                  — ABC interfaces
│   └── use_cases/
│       ├── expenses/           — CreateExpense, ListExpenses, GetExpense, UpdateExpense, DeleteExpense
│       ├── categories/         — ListCategories, CreateCategory, UpdateCategory, DeactivateCategory
│       ├── reports/            — GenerateSummary, GenerateMonthly
│       └── telegram/           — ProcessMessage, ConfirmExpense, HandleCommand
└── adapters/
    ├── primary/
    │   ├── bff/                — REST API (/api/v2/...)
    │   └── telegram/           — Webhook router + handlers
    └── secondary/
        ├── supabase/           — Expense + category repositories
        ├── openrouter/         — LLM adapter
        ├── telegram_api/       — Telegram notifier
        └── memory/             — In-memory pending state (TTL 10 min)
```

## Architecture Contracts

Enforced at test time by `import-linter` (`tests/v2/test_architecture.py`):

- Domain never imports from adapters
- Secondary adapters never import from primary adapters
- Entities and ports never import from use cases

## LLM Strategy

| Model | Tasks | Reason |
|---|---|---|
| `anthropic/claude-sonnet-4-6` | Image/PDF extraction, monthly reports | Needs vision capability and higher quality reasoning |
| `anthropic/claude-haiku-4-5` | Text extraction, categorization, duplicate checking | High volume, lower cost |

Both models are accessed via OpenRouter using the OpenAI-compatible SDK pointed at `openrouter.ai/api/v1`.
