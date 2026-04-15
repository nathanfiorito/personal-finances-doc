# Telegram Bot

The bot receives receipts via webhook (photo, PDF, or text), extracts expense data using AI, asks for confirmation, and persists only after explicit user approval.

## Request Flow

```
1. User sends receipt (photo / PDF / text)
        │
        ▼
2. POST /webhook
   ├── TelegramWebhookFilter validates X-Telegram-Bot-Api-Secret-Token (→ 403 if wrong)
   └── TelegramWebhookController checks chat ID against TELEGRAM_ALLOWED_CHAT_ID (silent ignore if wrong)
        │
        ▼
3. Route by input type:
   ├── Text message       → ProcessMessageUseCase(entryType="text",  content=text)
   ├── Photo              → download largest photo, base64-encode → ProcessMessageUseCase(entryType="image", content=base64)
   └── PDF document       → download + extract text → ProcessMessageUseCase(entryType="pdf",  content=text)
        │
        ▼
4. ProcessMessageUseCase:
   a. LlmPort.extractTransaction(content, entryType) → ExtractedTransaction
   b. CategoryRepository.listAll() → active categories
   c. LlmPort.categorize(extracted, categoryNames)  → best matching category name
   d. PendingStatePort.set(chatId, PendingTransaction{TTL=10 min})
   e. NotifierPort.sendMessage() with inline keyboard:
         [✅ Confirmar] [❌ Cancelar] [🏷️ Alterar Categoria]
        │
        ├── User clicks ❌ Cancelar
        │       └── CancelTransactionUseCase → PendingStatePort.clear() → edit message with ❌
        │
        ├── User clicks 🏷️ Alterar Categoria
        │       └── Bot sends a new keyboard with all active categories (2 per row)
        │               └── User selects category
        │                       └── ChangeCategoryUseCase → PendingStatePort.updateCategory()
        │                               → edit confirmation message with updated category
        │
        └── User clicks ✅ Confirmar → ConfirmTransactionUseCase(skipDuplicateCheck=false)
                │
                ▼
           a. TransactionRepository.listRecent(3)
           b. LlmPort.isDuplicate(extracted, recentTransactions)
                │
                ├── Duplicate detected → bot warns, sends [Salvar mesmo assim] [Cancelar] → return
                │       └── User clicks "Salvar mesmo assim"
                │               └── ConfirmTransactionUseCase(skipDuplicateCheck=true)
                │
                └── No duplicate (or skipped) → TransactionRepository.save(extracted, categoryId)
                        └── PendingStatePort.clear() → edit message with ✅
```

## Bot Commands

| Command | Description |
|---|---|
| `/start` | Welcome message |
| `/ajuda` | List all available commands |
| `/relatorio` | Report for current month |
| `/relatorio semana` | Report for current week |
| `/relatorio anterior` | Report for previous month |
| `/relatorio mes` | Report for current month |
| `/relatorio MM/AAAA` | Report for a specific month (e.g. `/relatorio 03/2026`) |
| `/exportar` | Export current month as CSV |
| `/exportar semana\|anterior\|mes\|MM/AAAA` | Export for a specific period |
| `/categorias` | List active categories |
| `/categorias add <name>` | Add a new category |

## Pending State

- Stored in-memory in `InMemoryPendingStateAdapter` (`ConcurrentHashMap<Long, PendingTransaction>`)
- Keyed by `chat_id` — one pending transaction per chat at a time
- TTL: 10 minutes (`PendingTransaction.expiresAt = Instant.now().plus(10 min)`)
- Expiry is checked lazily on `get()` and `updateCategory()` — no background sweep
- Not persisted across server restarts; a restart clears all pending state

## Security

| Control | Implementation |
|---|---|
| Webhook secret | `TelegramWebhookFilter` checks `X-Telegram-Bot-Api-Secret-Token` before JWT filter; returns 403 if missing or wrong |
| Chat ID restriction | `TelegramWebhookController` silently ignores any message/callback from a chat ID other than `TELEGRAM_ALLOWED_CHAT_ID` |
| HTTPS | Telegram Bot API requires HTTPS for webhook URLs; enforced by Cloudflare Tunnel (dev) or the VPS reverse proxy (prod) |

## Callback Data Format

Inline keyboard buttons use these `callback_data` values:

| Value | Action |
|---|---|
| `confirm` | Confirm with duplicate check |
| `force_confirm` | Confirm, skipping duplicate check |
| `cancel` | Cancel and discard pending state |
| `edit_category` | Show category selection keyboard |
| `set_category:{id}:{name}` | Set a specific category (e.g. `set_category:3:Transporte`) |
