# Telegram Bot

The bot receives receipts via webhook (photo, PDF, or text), extracts expense data using AI, asks for confirmation, and persists only after explicit user approval.

## Request Flow

```
1. User sends receipt (photo / PDF / text)
        │
        ▼
2. POST /webhook → validate X-Telegram-Bot-Api-Secret-Token + TELEGRAM_ALLOWED_CHAT_ID
        │
        ▼
3. Route by input type → ProcessMessage use case
        │
        ▼
4. LLMPort.extract_expense() → structured expense data
        │
        ▼
5. Store in InMemoryPendingStateAdapter (keyed by chat_id, TTL 10 min)
        │
        ▼
6. Bot sends confirmation message with inline keyboard [✅ Confirm] [❌ Cancel]
        │
        ├── User clicks ❌ Cancel → discard pending state
        │
        └── User clicks ✅ Confirm → ConfirmExpense use case
                │
                ▼
           LLMPort.check_duplicate() → compare against 3 most recent expenses
                │
                ├── Duplicate detected → bot warns user, asks to override
                │
                └── No duplicate (or user overrides) → ExpenseRepository.save()
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
| `/relatorio MM/AAAA` | Report for a specific month |
| `/exportar` | Export current month as CSV |
| `/exportar semana\|anterior\|mes\|MM/AAAA` | Export for a specific period |
| `/categorias` | List active categories |
| `/categorias add <name>` | Add a new category |

## Pending State

- Stored in-memory in `InMemoryPendingStateAdapter`
- Keyed by `chat_id` (one pending expense per chat at a time)
- TTL: 10 minutes — auto-expires unconfirmed entries
- Not persisted across server restarts

## Security

- Webhook URL protected by `X-Telegram-Bot-Api-Secret-Token` header
- All messages from chat IDs other than `TELEGRAM_ALLOWED_CHAT_ID` are silently ignored
