# Personal Finances

Personal expense tracking system — Telegram bot + web dashboard.

## What is this?

Personal Finances is a private, single-user expense tracking system. It consists of:

- A **Telegram bot** that receives payment receipts (photo, PDF, or text), extracts and categorizes expenses using AI, and sends a confirmation before saving
- A **web dashboard** (Next.js) for viewing, filtering, and managing expenses
- A **FastAPI backend** with hexagonal architecture connecting both

## Stack

| Component | Technologies |
|---|---|
| Backend | Python 3.12, FastAPI, hexagonal architecture |
| LLM | Claude Sonnet 4.6 (vision/reports), Haiku 4.5 (text/categorization) via OpenRouter |
| Database | Supabase (PostgreSQL) |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Hosting | Render (backend), Vercel (frontend) |

## Sections

- [Architecture](/architecture) — system design, hexagonal layers, request flows
- [API Reference](/api-reference) — REST endpoints, authentication, error codes
- [Database](/database) — schema, tables, indexes, relationships
- [Security](/security) — auth model, webhook validation, access control
- [Roadmap](/roadmap) — milestones and future plans
