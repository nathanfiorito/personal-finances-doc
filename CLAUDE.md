# CLAUDE.md — personal-finances-doc

This file provides guidance to Claude Code when working in this repository.

**For anything inside `content/`, read `content/CLAUDE.md` first.**

## Project Overview

Nextra 4 documentation site for the Personal Finances system. Static MDX content, private reference, not public-facing.

## Stack

- **Framework:** Nextra 4 (`nextra` + `nextra-theme-docs`) on top of Next.js 15
- **Content:** MDX files in `content/`
- **Sidebar navigation:** `_meta.js` files at each level of `content/`

## Commands

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
```

## Layout

- `content/` — MDX pages and `_meta.js` sidebar metadata. See `content/CLAUDE.md` for authoring conventions.
- `app/[[...mdxPath]]/page.jsx` — dynamic route handler; do not modify.
- `mdx-components.js` — `Wrapper` component that injects the TOC sidebar.

## Git workflow

Never commit directly to `main` or `develop`. Always create a feature branch and open a PR — even for documentation changes.
