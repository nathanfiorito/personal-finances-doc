# personal-finances-doc

Documentation site for the Personal Finances project — built with [Nextra](https://nextra.site/) (Next.js + MDX).

## Stack

| Component | Technology |
|---|---|
| Framework | Next.js 15, React 19 |
| Docs theme | Nextra 4 + nextra-theme-docs |
| Content | MDX (`.md` files in `content/`) |

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content Structure

```
content/
├── index.md              — Home page
├── architecture/         — System design, hexagonal layers, request flows
├── api-reference/        — REST endpoints, authentication, error codes
├── database/             — Schema, tables, indexes, relationships
├── security/             — Auth model, webhook validation, access control
└── roadmap/              — Milestones and future plans
```

To add a page, create a `.md` file inside the relevant section. To reorder or rename sidebar entries, edit the `_meta.js` file in that section's folder.

## Related Repositories

- [personal-finances-backend](https://github.com/nathanfiorito/personal-finances-backend) — FastAPI + Telegram bot
- [personal-finances-frontend](https://github.com/nathanfiorito/personal-finances-frontend) — Next.js web dashboard
