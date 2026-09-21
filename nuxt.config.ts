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
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl
  },

  runtimeConfig: {
    public: {
      siteUrl
    }
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

  routeRules: {
    '/en': { redirect: { to: '/', statusCode: 301 } },
    '/en/**': { redirect: { to: '/**', statusCode: 301 } }
  },

  experimental: {
    asyncContext: true
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

  compatibilityDate: '2026-06-30',

  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    },
    cloudflare: {
      nodeCompat: true
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
  }
})
