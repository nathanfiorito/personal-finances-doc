# Personal Finances

Personal expense tracking system — Telegram bot + web dashboard.

## What is this?

Personal Finances is a private, single-user expense tracking system. It consists of:

- A **Telegram bot** that receives payment receipts (photo, PDF, or text), extracts and categorizes expenses using AI, and sends a confirmation before saving
- A **web dashboard** (Next.js) for viewing, filtering, and managing expenses
- A **Spring Boot backend** with hexagonal architecture connecting both

## Stack

| Component | Technologies |
|---|---|
| Backend | Java 25, Spring Boot 3.4.5, hexagonal architecture |
| Auth | Spring Security + JWT (JJWT 0.12.6), BCrypt |
| LLM | Claude Sonnet 4.6 (vision/reports), Haiku 4.5 (text/categorization) via OpenRouter |
| Database | PostgreSQL (self-hosted), Flyway migrations, Spring Data JPA |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Hosting | Render (backend), Vercel (frontend) |

## Sections

- [Architecture](/architecture) — system design, hexagonal layers, request flows
- [API Reference](/api-reference) — REST endpoints, authentication, error codes
- [Database](/database) — schema, tables, indexes, relationships
- [Security](/security) — auth model, webhook validation, access control
- [Roadmap](/roadmap) — milestones and future plans
