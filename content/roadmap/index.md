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
- [x] REST API (hexagonal architecture) with Supabase Auth JWT
- [x] Next.js dashboard — expenses, reports, categories
- [x] Expense and income tracking (`transaction_type`)
- [x] CI/CD pipeline (GitHub Actions → Render + Vercel)
- [x] Monthly automated report via APScheduler
- [x] CSV export

---

## In Progress

- [ ] Frontend design system (Tailwind-based, mobile-responsive)
- [ ] Documentation site (`personal-finances-doc`)

---

## Planned

- [ ] Mobile-responsive frontend (spec written)
- [ ] Income tracking UI (spec written)
- [ ] Budget limits per category with alerts
- [ ] Recurring expense detection
- [ ] Annual summary report
- [ ] Dark mode
