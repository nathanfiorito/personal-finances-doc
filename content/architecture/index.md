# Architecture Overview

Personal Finances follows a hexagonal (ports & adapters) architecture on the backend, with a clear separation between the Telegram bot interface, the REST API, and the business logic layer.

## System Components

```
┌─────────────────┐     ┌──────────────────────────────────┐     ┌──────────────┐
│  Telegram App   │────▶│        Spring Boot Backend        │────▶│  PostgreSQL  │
│  (user sends    │     │  ┌─────────────┐ ┌─────────────┐ │     │ (self-hosted)│
│   receipts)     │     │  │ Telegram    │ │  REST API   │ │     └──────────────┘
└─────────────────┘     │  │ Controller  │ │  (BFF)      │ │
                        │  └─────────────┘ └─────────────┘ │     ┌──────────────┐
                        │        │                │         │────▶│  OpenRouter  │
                        │        ▼                ▼         │     │  (LLM API)   │
                        │  ┌─────────────────────────────┐  │     └──────────────┘
                        │  │     Domain / Use Cases      │  │
                        │  └─────────────────────────────┘  │
                        └──────────────────────────────────┘
                                        ▲
                        ┌───────────────┘
                        │
                ┌───────────────┐
                │  Next.js      │
                │  Dashboard    │
                └───────────────┘
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| OpenRouter instead of Anthropic direct | OpenAI-compatible SDK; easier model switching |
| Two LLM models | Sonnet 4.6 for vision/reports (quality); Haiku 4.5 for text tasks (cost) |
| Mandatory confirmation | Never persist an expense without explicit user approval |
| In-memory pending state | Keeps DB clean; TTL 10 min to auto-expire unconfirmed entries |
| Self-hosted PostgreSQL + Flyway | Full control over schema, no vendor lock-in |
| Spring JWT (stateless) | No session storage; each request is independently authenticated |

## Sub-sections

- [Backend](/architecture/backend) — hexagonal layers, package layout
- [Frontend](/architecture/frontend) — Next.js structure, auth flow
- [Telegram Bot](/architecture/telegram-bot) — bot flow, commands, confirmation
