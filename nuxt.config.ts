import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { contentEditUrl, contentFileContributors, contentFileMtime, contentFileUpdatedAt, contentRelative, contentWorkingTreeAuthor } from './config/content-git'

const DEFAULT_SITE_URL = 'https://syscraft.dev'
const PREVIEW_SITE_URL = 'https://syscraft.tailz.dev'
const repoRoot = fileURLToPath(new URL('.', import.meta.url))

function resolveSiteUrl() {
  const explicit = (process.env.NUXT_PUBLIC_SITE_URL || process.env.NUXT_SITE_URL || '').replace(/\/+$/, '')
  if (explicit) {
    return explicit
  }

  const hostedOn = [
    process.env.CF_PAGES_URL,
    process.env.DEPLOY_PRIME_URL
  ].filter(Boolean).join(' ')
  if (hostedOn.includes('syscraft-aot.pages.dev') || hostedOn.includes('syscraft.tailz.dev')) {
    return PREVIEW_SITE_URL
  }

  return DEFAULT_SITE_URL
}

const siteUrl = resolveSiteUrl()
process.env.NUXT_SITE_URL = siteUrl
process.env.NUXT_PUBLIC_SITE_URL = siteUrl

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl,
    name: 'Syscraft',
    trailingSlash: true
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3
        }
      }
    },
    experimental: {
      sqliteConnector: 'native'
    }
  },

  runtimeConfig: {
    public: {
      siteUrl
    }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    // Static Pages output: no Worker. Unknown URLs are a prerendered 404,
    // and legacy /en URLs redirect from public/_redirects.
    preset: 'cloudflare-pages-static',
    prerender: {
      routes: [
        '/',
        '/sitemap.xml'
      ],
      crawlLinks: true
    },
    hooks: {
      async close() {
        // Pages serves 404.html on its own. Status 404 is not a valid _redirects code.
        const redirectsPath = resolve(repoRoot, 'dist/_redirects')
        // nuxt prepare closes Nitro before a build has written this file.
        if (!existsSync(redirectsPath)) {
          return
        }
        const text = await readFile(redirectsPath, 'utf8')
        const cleaned = text
          .split('\n')
          .filter(line => !/^\s*\/\*\s+\/404\.html\s+404\s*$/.test(line))
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
        if (cleaned !== text) {
          await writeFile(redirectsPath, cleaned.endsWith('\n') ? cleaned : `${cleaned}\n`)
        }
      }
    }
  },

  hooks: {
    'content:file:afterParse'(ctx) {
      if (ctx.collection.name !== 'docs') {
        return
      }
      const relative = contentRelative(ctx.file.path)
      const updatedAt = contentFileUpdatedAt(repoRoot, ctx.file.path) || contentFileMtime(repoRoot, ctx.file.path)
      if (updatedAt) {
        ctx.content.updatedAt = updatedAt
        const sitemap = ctx.content.sitemap
        if (sitemap && typeof sitemap === 'object') {
          const entry = sitemap as { lastmod?: string }
          entry.lastmod ||= updatedAt
        }
      }
      if (relative) {
        ctx.content.editUrl = contentEditUrl(relative)
        const pageContributors = contentFileContributors(repoRoot, ctx.file.path)
        ctx.content.contributors = pageContributors.length
          ? pageContributors
          : contentWorkingTreeAuthor(repoRoot)
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  llms: {
    domain: siteUrl,
    title: 'Syscraft',
    description: 'Guides for Minecraft server admins, developers, and hosts.',
    full: {
      title: 'Syscraft wiki',
      description: 'Community guides for creating, maintaining, and growing Minecraft servers.'
    },
    sections: [
      {
        title: 'Guides',
        contentCollection: 'docs'
      }
    ]
  },

  ogImage: {
    zeroRuntime: true,
    defaults: {
      alt: 'Syscraft',
      width: 1200,
      height: 630
    }
  },

  sitemap: {
    zeroRuntime: true,
    discoverImages: false,
    exclude: [
      '/raw/**',
      '/__nuxt_content/**'
    ]
  }
})
