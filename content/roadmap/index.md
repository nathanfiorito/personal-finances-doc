# Roadmap

Development milestones and future plans for Personal Finances.

---

## Current Status

The system is live and in active use. Core features are complete.

---

## Completed

- [x] Telegram bot with image, PDF, and text receipt parsing
- [x] AI extraction with Claude Sonnet 4.6 (vision) and Haiku 4.5 (text)
- [x] AI categorization and duplicate detection
- [x] Mandatory confirmation before persisting expenses
- [x] REST API (hexagonal architecture)
- [x] Next.js dashboard — expenses, reports, categories
- [x] Expense and income tracking (`transaction_type`)
- [x] CI/CD pipeline (GitHub Actions → Hostinger VPS with Coolify + Vercel)
- [x] CSV export
- [x] Backend migration: Python/FastAPI → Java 25 / Spring Boot 3.4.5
- [x] Database migration: Supabase → self-hosted PostgreSQL (Flyway)
- [x] Auth migration: Supabase Auth → Spring Security + JWT (JJWT)

---

## In Progress

- [ ] Frontend design system (Tailwind-based, mobile-responsive)
- [ ] Documentation site (`personal-finances-doc`)

---

## Planned

- [ ] Monthly automated report (Spring `@Scheduled`)
- [ ] Mobile-responsive frontend (spec written)
- [ ] Income tracking UI (spec written)
- [ ] Budget limits per category with alerts
- [ ] Recurring expense detection
- [ ] Annual summary report
- [ ] Dark mode
