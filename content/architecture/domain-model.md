# Domain Model

The domain layer (`br.com.nathanfiorito.finances.domain`) contains only pure Java — no Spring, JPA, or HTTP imports. All types are Java records (immutable by construction).

## Enums

### `TransactionType`

```java
enum TransactionType { EXPENSE, INCOME }
```

### `PaymentMethod`

```java
enum PaymentMethod { CREDIT, DEBIT }
```

Stored uppercase in the database; serialised lowercase in the API (`"expense"`, `"credit"`).

---

## Core Records

### `Transaction`

The fully-hydrated view of a persisted transaction, returned from the repository after a save or query.

```java
record Transaction(
    UUID         id,
    BigDecimal   amount,
    LocalDate    date,
    String       establishment,
    String       description,
    Integer      categoryId,
    String       category,          // denormalised name
    String       taxId,
    String       entryType,         // "text" | "pdf" | "image" | "manual"
    TransactionType  transactionType,
    PaymentMethod    paymentMethod,
    Integer      cardId,
    String       cardAlias,         // denormalised card alias
    Double       confidence,
    LocalDateTime createdAt
)
```

### `ExtractedTransaction`

The intermediate representation produced by the LLM before the user confirms it. Never persisted directly; stored in `PendingTransaction`.

```java
record ExtractedTransaction(
    BigDecimal       amount,          // validated: positive, ≤ 999,999.99
    LocalDate        date,
    String           establishment,
    String           description,
    String           taxId,           // auto-formatted to XX.XXX.XXX/XXXX-XX if 14 digits
    String           entryType,
    TransactionType  transactionType,
    PaymentMethod    paymentMethod,
    double           confidence       // 0.0–1.0
)
```

The compact constructor validates `amount > 0` and `amount ≤ 999,999.99`, throwing `IllegalArgumentException` if invalid. It also formats 14-digit `taxId` strings as Brazilian CNPJs.

### `TransactionUpdate`

Partial update payload for `PUT /api/v1/transactions/{id}`. All fields are nullable — only non-null fields are applied.

```java
record TransactionUpdate(
    BigDecimal       amount,
    LocalDate        date,
    String           establishment,
    String           description,
    Integer          categoryId,
    PaymentMethod    paymentMethod,
    TransactionType  transactionType,
    Integer          cardId
)
```

### `Category`

```java
record Category(int id, String name, boolean active)
```

### `PendingTransaction`

In-memory state for a transaction that has been extracted but not yet confirmed by the user.

```java
record PendingTransaction(
    ExtractedTransaction extracted,
    String   category,      // LLM-assigned category name
    int      categoryId,
    long     chatId,
    Long     messageId,     // Telegram message ID (for edit operations)
    Instant  expiresAt      // now + 10 minutes
)
```

Factory method `PendingTransaction.create(extracted, category, categoryId, chatId, messageId)` sets `expiresAt = Instant.now().plus(10 min)`.

`isExpired()` returns `true` if `Instant.now().isAfter(expiresAt)`.

---

## Card Records

### `Card`

```java
record Card(
    int           id,
    String        alias,
    String        bank,
    String        lastFourDigits,
    int           closingDay,
    int           dueDay,
    boolean       active,
    LocalDateTime createdAt
)
```

### `Invoice`

Represents a billing period's transactions for a specific card.

```java
record Invoice(
    int             cardId,
    LocalDate       periodStart,
    LocalDate       periodEnd,
    LocalDate       closingDate,
    LocalDate       dueDate,
    BigDecimal      total,
    List<Transaction> transactions
)
```

### `InvoicePrediction`

AI-generated spending prediction for a billing cycle. Cached in the database, refreshed every 24 hours.

```java
record InvoicePrediction(
    int           cardId,
    BigDecimal    predictedTotal,
    BigDecimal    currentTotal,
    int           daysRemaining,
    BigDecimal    dailyAverage,
    LocalDateTime generatedAt,
    String        confidence,       // "low", "medium", "high"
    BigDecimal    projectedRemaining,
    int           basedOnInvoices
)
```

---

## Report Records

### `SummaryItem`

One row in a summary report — totals for a single category over a date range.

```java
record SummaryItem(String category, BigDecimal total, int count)
```

### `MonthlyItem`

One month's totals, broken down by category.

```java
record MonthlyItem(int month, BigDecimal total, List<MonthlyCategoryItem> byCategory)
```

### `MonthlyCategoryItem`

```java
record MonthlyCategoryItem(String category, BigDecimal total)
```

---

## Shared

### `PageResult<T>`

Generic paginated result used by both `TransactionRepository` and `CategoryRepository`.

```java
record PageResult<T>(List<T> items, int total)
```

`total` is the total number of matching records across all pages (not just the current page).

---

## Ports (Domain Interfaces)

Ports are interfaces declared in the domain layer. The infrastructure layer provides implementations.

### `LlmPort`

```java
interface LlmPort {
    // Extract structured data from a receipt
    ExtractedTransaction extractTransaction(String content, String entryType);

    // Return true if 'extracted' appears to be a duplicate of any recent transaction
    boolean isDuplicate(ExtractedTransaction extracted, List<Transaction> recentTransactions);

    // Return the best matching category name from the provided list
    String categorize(ExtractedTransaction extracted, List<String> categoryNames);

    // Generate a spending prediction for the current billing cycle
    InvoicePrediction generateInvoicePrediction(int cardId, List<Invoice> historicalInvoices, Invoice currentInvoice);
}
```

### `TransactionRepository`

```java
interface TransactionRepository {
    Transaction            save(ExtractedTransaction extracted, int categoryId);
    Transaction            save(ExtractedTransaction extracted, int categoryId, Integer cardId);
    Optional<Transaction>  findById(UUID id);
    PageResult<Transaction> listPaginated(int page, int pageSize);
    List<Transaction>      listByPeriod(LocalDate start, LocalDate end, Optional<TransactionType> type);
    List<Transaction>      listByCardAndPeriod(int cardId, LocalDate start, LocalDate end);
    List<Transaction>      listRecent(int limit);
    Optional<Transaction>  update(UUID id, TransactionUpdate data);
    boolean                delete(UUID id);
}
```

### `CategoryRepository`

```java
interface CategoryRepository {
    Category               save(String name);
    List<Category>         listAll();                        // active only
    Optional<Category>     findById(int id);
    PageResult<Category>   listPaginated(int page, int pageSize, boolean activeOnly);
    Optional<Category>     update(int id, String name);
    boolean                deactivate(int id);
}
```

### `CardRepository`

```java
interface CardRepository {
    Card               save(String alias, String bank, String lastFourDigits, int closingDay, int dueDay);
    Optional<Card>     findById(int id);
    List<Card>         listAll();                        // active only
    Optional<Card>     update(int id, String alias, String bank, String lastFourDigits, int closingDay, int dueDay);
    boolean            deactivate(int id);
}
```

### `InvoicePredictionRepository`

```java
interface InvoicePredictionRepository {
    Optional<InvoicePrediction> findByCardAndMonth(int cardId, LocalDate invoiceMonth);
    InvoicePrediction           save(InvoicePrediction prediction);
}
```

### `NotifierPort`

```java
interface NotifierPort {
    record NotificationButton(String text, String callbackData) {}

    void sendMessage(long chatId, String text, String parseMode, List<List<NotificationButton>> buttons);
    void editMessage(long chatId, long messageId, String text, String parseMode, List<List<NotificationButton>> buttons);
    void answerCallback(String callbackId, String text);
    void sendFile(long chatId, byte[] content, String filename, String caption);
}
```

### `PendingStatePort`

```java
interface PendingStatePort {
    void                       set(long chatId, PendingTransaction state);
    Optional<PendingTransaction> get(long chatId);                         // returns empty if expired
    boolean                    updateCategory(long chatId, String category, int categoryId);  // false if missing/expired
    void                       clear(long chatId);
}
```

---

## Exceptions

| Exception | Package | Thrown by |
|---|---|---|
| `TransactionNotFoundException` | `domain.transaction.exceptions` | `GetTransactionUseCase`, `UpdateTransactionUseCase`, `DeleteTransactionUseCase` |
| `CategoryNotFoundException` | `domain.category.exceptions` | `UpdateCategoryUseCase`, `DeactivateCategoryUseCase`, `TransactionRepositoryAdapter` |
| `CardNotFoundException` | `domain.card.exceptions` | `GetCardUseCase`, `UpdateCardUseCase`, `DeactivateCardUseCase`, `GetInvoiceUseCase` |
| `LlmExtractionException` | `domain.transaction.exceptions` | `OpenRouterLlmAdapter` on parse/HTTP failure |

All exceptions are mapped to HTTP responses by `GlobalExceptionHandler` using a standardised `ErrorResponse` envelope (`status`, `error`, `message`, `timestamp`, optional `details`):

| Exception / Scenario | HTTP Status |
|---|---|
| `TransactionNotFoundException` | `404 Not Found` |
| `CategoryNotFoundException` | `404 Not Found` |
| `CardNotFoundException` | `404 Not Found` |
| `LlmExtractionException` | `500 Internal Server Error` |
| `MethodArgumentNotValidException` / `ConstraintViolationException` | `400 Bad Request` (with field-level `details`) |
| `MissingServletRequestParameterException` / `MethodArgumentTypeMismatchException` | `400 Bad Request` |
| `HttpMessageNotReadableException` / `IllegalArgumentException` | `400 Bad Request` |
| `AccessDeniedException` | `403 Forbidden` |
| `NoResourceFoundException` | `404 Not Found` |
| `HttpRequestMethodNotSupportedException` | `405 Method Not Allowed` |
| `DataIntegrityViolationException` | `409 Conflict` |
| `HttpMediaTypeNotSupportedException` | `415 Unsupported Media Type` |
| Any uncaught `Exception` | `500 Internal Server Error` |
