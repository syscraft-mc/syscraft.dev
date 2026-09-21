# syscraft.dev

Minecraft server-admin wiki for the [Syscraft Discord](https://discord.gg/Dx6SSkx). Nuxt 4 site in this repo.

The seven original guides kept their git history across the move from `src/content/docs/en/*.mdx` to `content/*.md`. Use `git log --follow` on a guide to see the earlier authors.

## Stack

- Nuxt 4 + Nuxt UI + Nuxt Content
- Search: Nuxt Content `UContentSearch` (⌘K) — no Algolia
- Deploy: Cloudflare Pages

## Setup

```bash
pnpm install
pnpm dev
```

## Content

Guides live in `content/` (`01.starter-server.md` → `/starter-server`, etc.). Homepage is `content/index.md`. Old `/en/...` URLs 301 to the same slug without `en`.

## Site URL

Canonicals, JSON-LD, and OG image URLs use one build-time value:

| Env | Default | Purpose |
| --- | --- | --- |
| `NUXT_PUBLIC_SITE_URL` | `https://syscraft.dev` | Canonicals, JSON-LD, and OG image URLs. Also set `NUXT_SITE_URL` to the same value — `nuxt-og-image` reads that and otherwise uses `CF_PAGES_URL` (the unique `*.pages.dev` deploy). Preview: `https://syscraft.tailz.dev`. |

Set it on the Pages project before building. Local: copy `.env.example` to `.env`.

## Deploy

```bash
pnpm deploy
```
