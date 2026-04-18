# CLAUDE.md — content/

## Purpose

The documentation source (MDX) and sidebar metadata for the Nextra 4 site.

## Section Inventory

| Section | Purpose | Current pages |
|---|---|---|
| `index.md` | Home page | — |
| `architecture/` | System design, layers, flows | `index.md`, `backend.md`, `frontend.md`, `telegram-bot.md`, `ai-integration.md`, `domain-model.md`, `testing.md` |
| `api-reference/` | REST endpoints | `index.md`, `transactions.md`, `categories.md`, `reports.md`, `cards.md`, `invoice-import.mdx`, `export.md` |
| `database/` | Schema, tables | `index.md` |
| `security/` | Auth, webhook, access control | `index.md` |
| `roadmap/` | Milestones | `index.md` |

## How to add a page inside an existing section

1. Create `.md` (or `.mdx`) inside the section folder, e.g. `content/architecture/observability.md`.
2. Add the key to that section's `_meta.js`:

```js
// content/architecture/_meta.js
export default {
  index: 'Overview',
  backend: 'Backend',
  frontend: 'Frontend',
  observability: 'Observability',   // ← new
}
```

## How to add a new top-level section

1. Create `content/<section>/index.md` with a `# Title` heading.
2. Add the key to `content/_meta.js`:

```js
// content/_meta.js
export default {
  index: 'Home',
  architecture: 'Architecture',
  'api-reference': 'API Reference',
  database: 'Database',
  security: 'Security',
  roadmap: 'Roadmap',
  deployment: 'Deployment',   // ← new
}
```

## Nextra 4 routing rules

- Files in `content/` map directly to URLs: `content/architecture/frontend.md` → `/architecture/frontend`.
- The dynamic route handler is `app/[[...mdxPath]]/page.jsx` — do not modify it.
- The `Wrapper` component in `mdx-components.js` wraps all MDX pages with the TOC sidebar. Keep this wrapper in place for sidebars to render correctly.
- Sidebar order and labels are controlled by `_meta.js` (JS, not JSON) at each level.

## Language rule

MDX prose can be Portuguese or English — audience is the single-user author. Keep **code snippets, API field names, database column names, and identifiers** in English to match the backend rule (`../CLAUDE.md`).

## When to update this file

- New page → add it to the Section Inventory table's right-hand column.
- New section → add a row to Section Inventory **and** update the snippet in "How to add a new top-level section" to match `content/_meta.js`.

## Pointers

- Nextra/Next.js setup, build commands: `../CLAUDE.md`.
- Backend code that the API reference pages describe: `../../personal-finances-backend/app/src/main/java/.../interfaces/CLAUDE.md`.
