import type { ContentNavigationItem } from '@nuxt/content'

const ADMIN_PATHS = [
  '/starter-server',
  '/getting-players',
  '/server-software',
  '/recommended-plugins',
  '/server-security',
  '/server-networks',
  '/permissions',
  '/advertising'
]

const HOST_PATHS = [
  '/server-hosting',
  '/server-performance',
  '/how-much-ram',
  '/server-management'
]

const MORE_PATHS = [
  '/resources',
  '/new-server-checklist'
]

const NAV_TITLES: Record<string, string> = {
  '/starter-server': 'Starter Server',
  '/getting-players': 'Getting Players',
  '/server-software': 'Server Software',
  '/recommended-plugins': 'Recommended Plugins',
  '/server-security': 'Server Security',
  '/server-networks': 'Server Networks',
  '/permissions': 'Permissions',
  '/advertising': 'Advertising',
  '/server-hosting': 'Choosing a Host',
  '/server-performance': 'Server Performance',
  '/how-much-ram': 'How Much RAM',
  '/server-management': 'Management Tools',
  '/resources': 'Resources',
  '/new-server-checklist': 'New Server Checklist'
}

export const GUIDE_SECTIONS = [
  {
    title: 'Admin',
    description: 'Stand up a server, pick software, and keep players around.',
    paths: ADMIN_PATHS
  },
  {
    title: 'Host',
    description: 'Choose hardware and keep TPS stable.',
    paths: HOST_PATHS
  },
  {
    title: 'More',
    description: 'External guides and a checklist for a new server.',
    paths: MORE_PATHS
  }
] as const

export const GUIDE_ICONS: Record<string, string> = {
  '/starter-server': 'i-lucide-rocket',
  '/getting-players': 'i-lucide-users',
  '/server-software': 'i-lucide-boxes',
  '/recommended-plugins': 'i-lucide-puzzle',
  '/server-security': 'i-lucide-shield-check',
  '/server-networks': 'i-lucide-share-2',
  '/permissions': 'i-lucide-key',
  '/advertising': 'i-lucide-megaphone',
  '/server-hosting': 'i-lucide-cloud',
  '/server-performance': 'i-lucide-gauge',
  '/how-much-ram': 'i-lucide-memory-stick',
  '/server-management': 'i-lucide-panel-top',
  '/resources': 'i-lucide-library',
  '/new-server-checklist': 'i-lucide-list-checks'
}

export function navTitleFor(path: string, fallback?: string) {
  return NAV_TITLES[path] || fallback || path
}

function flattenPages(items: ContentNavigationItem[]): ContentNavigationItem[] {
  const out: ContentNavigationItem[] = []
  for (const item of items) {
    if (item.children?.length) {
      out.push(...flattenPages(item.children))
    } else if (item.path) {
      out.push(item)
    }
  }
  return out
}

export function groupDocsNavigation(items: ContentNavigationItem[] | null | undefined): ContentNavigationItem[] {
  const pages = flattenPages(items || [])
  const pick = (paths: string[]) => paths
    .map((path) => {
      const page = pages.find(item => item.path === path)
      if (!page) {
        return undefined
      }
      return {
        ...page,
        title: NAV_TITLES[path] || page.title
      }
    })
    .filter((page): page is ContentNavigationItem => Boolean(page))

  return [
    {
      title: 'Admin',
      path: '/starter-server',
      children: pick(ADMIN_PATHS)
    },
    {
      title: 'Host',
      path: '/server-hosting',
      children: pick(HOST_PATHS)
    },
    {
      title: 'More',
      path: '/resources',
      children: pick(MORE_PATHS)
    }
  ]
}
