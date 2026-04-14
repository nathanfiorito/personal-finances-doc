# CLAUDE.md — personal-finances-doc

This file provides guidance to Claude Code when working in this repository.

## Project Overview

Nextra 4 documentation site for the personal finances system. Static site generated from MDX files. Private reference — not public-facing.

## Stack

- **Framework:** Nextra 4 (`nextra` + `nextra-theme-docs`) on top of Next.js 15
- **Content:** MDX files in `content/`
- **Sidebar navigation:** `_meta.js` files at each level of `content/`

## Commands

```bash
npm install
npm run dev     # dev server at http://localhost:3000
npm run build   # production build
```

## Content Structure

```
content/
├── _meta.js           — top-level sidebar order and labels
├── index.md           — home page
├── architecture/      — system architecture docs
├── api-reference/     — REST API reference
├── database/          — schema and migrations
├── security/          — auth and security notes
└── roadmap/           — planned features
```

Each subdirectory that has multiple pages needs its own `_meta.js`.

## How to add a new top-level section

1. Create a new folder under `content/`, e.g. `content/deployment/`.
2. Add an `index.md` (or `index.mdx`) with a `# Title` heading.
3. Add the key to `content/_meta.js`:

```js
// content/_meta.js
export default {
  index: 'Home',
  architecture: 'Architecture',
  'api-reference': 'API Reference',
  database: 'Database',
  security: 'Security',
  roadmap: 'Roadmap',
  deployment: 'Deployment',   // ← add here
}
```

## How to add a page inside an existing section

1. Create a `.md` or `.mdx` file inside the section folder, e.g. `content/architecture/frontend.md`.
2. Add the key to that section's `_meta.js`:

```js
// content/architecture/_meta.js
export default {
  index: 'Overview',
  backend: 'Backend',
  frontend: 'Frontend',       // ← add here
  'telegram-bot': 'Telegram Bot',
}
```

## Git workflow

**Never commit directly to `main` or `develop`.**
Always create a feature branch and open a pull request. Direct commits to `main` or `develop` are not allowed — even for documentation changes.

```bash
git checkout -b feature/<description>
# make changes, commit
git push origin feature/<description>
# open PR → develop
```

## How Nextra 4 routing works

- Files in `content/` map directly to URLs: `content/architecture/frontend.md` → `/architecture/frontend`
- The dynamic route handler is `app/[[...mdxPath]]/page.jsx` — do not modify it
- The `Wrapper` component in `mdx-components.js` wraps all MDX pages with the TOC sidebar
- `_meta.js` (not `_meta.json`) controls sidebar order and labels
