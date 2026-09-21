import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'

const DEFAULT_SITE_URL = 'https://syscraft.dev'

function siteOrigin() {
  return String(useRuntimeConfig().public.siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, '')
}

function canonicalLoc(origin: string, path: string) {
  if (!path || path === '/') {
    return `${origin}/`
  }
  return `${origin}${path.replace(/\/$/, '')}/`
}

function xml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function lastmod(value: unknown) {
  if (typeof value !== 'string' || !value) {
    return
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return
  }
  return date.toISOString()
}

export default defineEventHandler(async (event) => {
  const origin = siteOrigin()
  const [landing, docs] = await Promise.all([
    queryCollection(event, 'landing' as keyof Collections).all(),
    queryCollection(event, 'docs' as keyof Collections).all()
  ])

  const pages = [
    ...landing.map(page => ({
      loc: canonicalLoc(origin, page.path || '/'),
      lastmod: undefined as string | undefined
    })),
    ...docs.map((page) => {
      const updatedAt = 'updatedAt' in page ? page.updatedAt : undefined
      return {
        loc: canonicalLoc(origin, page.path || '/'),
        lastmod: lastmod(updatedAt)
      }
    })
  ]
    .filter((page, index, all) => all.findIndex(item => item.loc === page.loc) === index)
    .sort((a, b) => {
      if (a.loc === `${origin}/`) {
        return -1
      }
      if (b.loc === `${origin}/`) {
        return 1
      }
      return a.loc.localeCompare(b.loc)
    })

  const urls = pages.map((page) => {
    const modified = page.lastmod
      ? `\n    <lastmod>${xml(page.lastmod)}</lastmod>`
      : ''
    return `  <url>\n    <loc>${xml(page.loc)}</loc>${modified}\n  </url>`
  }).join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
