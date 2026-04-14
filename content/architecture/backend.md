# Backend Architecture

The backend is a Java 25 / Spring Boot 3.4.5 application following the hexagonal (ports & adapters) pattern. All business logic lives in the domain and application layers with zero framework or database imports.

## Hexagonal Layers

```
Primary Adapters (REST, Telegram) → Application (Use Cases) → Domain (Ports + Records) ← Secondary Adapters (JPA, LLM, Telegram API)
```

| Layer | Package | Responsibility |
|---|---|---|
| Domain Records | `domain/*/records/` | Immutable Java records — `Transaction`, `Category`, `PendingTransaction` |
| Domain Ports | `domain/*/ports/` | Interfaces for all external dependencies — `TransactionRepository`, `LlmPort`, `NotifierPort`, `PendingStatePort` |
| Domain Exceptions | `domain/*/exceptions/` | `TransactionNotFoundException`, `CategoryNotFoundException`, `LlmExtractionException` |
| Domain Enums | `domain/*/enums/` | `TransactionType` (`EXPENSE`, `INCOME`), `PaymentMethod` (`CREDIT`, `DEBIT`) |
| Application Commands | `application/*/commands/` | Inputs for write operations — `CreateTransactionCommand`, `ConfirmTransactionCommand`, etc. |
| Application Queries | `application/*/queries/` | Inputs for read operations — `ListTransactionsQuery`, `GetSummaryQuery`, etc. |
| Application Use Cases | `application/*/usecases/` | All business logic — no Spring or JPA imports |
| Infrastructure Adapters | `infrastructure/` | JPA repositories, LLM adapter (OpenRouter), Telegram notifier, Spring Security |
| Interfaces | `interfaces/` | Spring MVC controllers (REST + Telegram webhook) and DTOs |

## Package Layout

```
br.com.nathanfiorito.finances/
├── FinancesApplication.java                    — Spring Boot entry point
│
├── domain/
│   ├── category/
│   │   ├── records/Category.java
│   │   ├── ports/CategoryRepository.java
│   │   └── exceptions/CategoryNotFoundException.java
│   ├── transaction/
│   │   ├── records/                            — Transaction, ExtractedTransaction, SummaryItem, MonthlyItem, TransactionUpdate
│   │   ├── ports/                              — TransactionRepository, LlmPort
│   │   ├── enums/                              — TransactionType, PaymentMethod
│   │   └── exceptions/                         — TransactionNotFoundException, LlmExtractionException
│   ├── telegram/
│   │   ├── records/PendingTransaction.java
│   │   └── ports/                              — NotifierPort, PendingStatePort
│   └── shared/PageResult.java
│
├── application/
│   ├── category/
│   │   ├── commands/                           — CreateCategoryCommand, UpdateCategoryCommand, DeactivateCategoryCommand
│   │   ├── queries/ListCategoriesQuery.java
│   │   └── usecases/                           — CreateCategory, UpdateCategory, DeactivateCategory, ListCategories
│   ├── transaction/
│   │   ├── commands/                           — CreateTransactionCommand, UpdateTransactionCommand, DeleteTransactionCommand
│   │   ├── queries/                            — ListTransactionsQuery, GetTransactionQuery, GetSummaryQuery, GetMonthlyQuery, ExportCsvQuery
│   │   └── usecases/                           — CreateTransaction, UpdateTransaction, DeleteTransaction, GetTransaction, ListTransactions, GetSummary, GetMonthly, ExportCsv
│   └── telegram/
│       ├── commands/                           — ProcessMessageCommand, ConfirmTransactionCommand, CancelTransactionCommand, ChangeCategoryCommand
│       └── usecases/                           — ProcessMessage, ConfirmTransaction, CancelTransaction, ChangeCategory
│
├── infrastructure/
│   ├── category/
│   │   ├── adapter/CategoryRepositoryAdapter.java
│   │   ├── entity/CategoryEntity.java
│   │   ├── mapper/CategoryMapper.java
│   │   └── repository/JpaCategoryRepository.java
│   ├── transaction/
│   │   ├── adapter/TransactionRepositoryAdapter.java
│   │   ├── entity/TransactionEntity.java
│   │   ├── mapper/TransactionMapper.java
│   │   └── repository/JpaTransactionRepository.java
│   ├── llm/
│   │   ├── adapter/OpenRouterLlmAdapter.java
│   │   └── config/OpenRouterConfig.java
│   ├── telegram/
│   │   ├── config/                             — TelegramConfig, TelegramProperties
│   │   ├── file/                               — TelegramFileDownloaderAdapter, DownloadedFile
│   │   ├── notifier/TelegramNotifierAdapter.java
│   │   └── pending/InMemoryPendingStateAdapter.java
│   ├── security/
│   │   ├── SecurityConfig.java                 — Spring Security filter chain, CORS, stateless JWT
│   │   ├── JwtService.java                     — Token generation and validation (JJWT 0.12.6)
│   │   ├── JwtAuthFilter.java                  — Per-request JWT extraction and auth
│   │   └── TelegramWebhookFilter.java          — Webhook secret header validation
│   └── config/UseCaseConfig.java               — @Bean wiring of use cases
│
└── interfaces/
    ├── rest/
    │   ├── auth/
    │   │   ├── AuthController.java             — POST /api/auth/login
    │   │   └── dto/                            — LoginRequest, LoginResponse
    │   ├── bff/
    │   │   ├── BffController.java              — GET /api/v1/bff/transactions
    │   │   └── dto/BffTransactionsResponse.java
    │   ├── transaction/
    │   │   ├── TransactionController.java      — CRUD /api/v1/transactions
    │   │   └── dto/                            — CreateTransactionRequest, UpdateTransactionRequest, TransactionResponse
    │   ├── category/
    │   │   ├── CategoryController.java         — CRUD /api/v1/categories
    │   │   └── dto/                            — CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse
    │   ├── report/
    │   │   ├── ReportController.java           — /api/v1/reports/summary, /api/v1/reports/monthly, /api/v1/export/csv
    │   │   └── dto/                            — SummaryItemResponse, MonthlyItemResponse, MonthlyCategoryItemResponse
    │   └── shared/
    │       ├── GlobalExceptionHandler.java     — Maps domain exceptions to HTTP responses
    │       └── PageResponse.java
    └── telegram/
        ├── TelegramWebhookController.java      — POST /webhook
        └── dto/TelegramUpdateDto.java
```

## Architecture Contracts

Enforced at test time by ArchUnit (`archunit-junit5`):

- Domain never imports from application or infrastructure
- Application never imports from infrastructure or interfaces
- Infrastructure adapters implement domain ports

## Build & Test

| Tool | Purpose |
|---|---|
| Maven (Spring Boot Parent 3.4.5) | Build, dependency management |
| JUnit 5 + Spring Boot Test | Unit and integration tests |
| ArchUnit 1.4.1 | Architecture layer enforcement |
| Testcontainers (PostgreSQL) | Real DB for integration tests |
| JaCoCo 0.8.13 | Code coverage reports |

```bash
# Run dev server
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR
./mvnw package
```

## LLM Strategy

| Model | Tasks | Reason |
|---|---|---|
| `anthropic/claude-sonnet-4-6` | Image/PDF extraction, monthly reports | Needs vision capability and higher quality reasoning |
| `anthropic/claude-haiku-4-5` | Text extraction, categorization, duplicate checking | High volume, lower cost |

Both models are accessed via OpenRouter using the official OpenAI Java SDK pointed at `openrouter.ai/api/v1`.
