export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'slate'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    },
    contentNavigation: {
      slots: {
        linkTitle: 'truncate'
      }
    },
    pageHeader: {
      slots: {
        root: 'border-b border-default py-8 min-w-0',
        headline: 'mb-2.5 text-sm font-semibold text-primary flex items-center gap-1.5',
        wrapper: 'flex flex-col gap-4 min-w-0',
        title: 'text-xl sm:text-2xl lg:text-3xl font-bold text-highlighted whitespace-nowrap'
      }
    }
  },
  seo: {
    siteName: 'Syscraft'
  },
  header: {
    title: 'Syscraft',
    to: '/',
    logo: {
      alt: 'Syscraft',
      light: '/syscraft-logo.gif',
      dark: '/syscraft-logo.gif'
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://discord.gg/Dx6SSkx',
      'target': '_blank',
      'aria-label': 'Syscraft Discord'
    }, {
      'icon': 'i-simple-icons-reddit',
      'to': 'https://reddit.com/r/syscraft',
      'target': '_blank',
      'aria-label': 'r/syscraft'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/syscraft-mc/syscraft.dev',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `Syscraft • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://discord.gg/Dx6SSkx',
      'target': '_blank',
      'aria-label': 'Syscraft Discord'
    }, {
      'icon': 'i-simple-icons-reddit',
      'to': 'https://reddit.com/r/syscraft',
      'target': '_blank',
      'aria-label': 'r/syscraft'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/syscraft-mc',
      'target': '_blank',
      'aria-label': 'Syscraft on GitHub'
    }]
  },
  toc: {
    title: 'On this page',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/Turbotailz/syscraft.dev/edit/main/content',
      links: [{
        icon: 'i-simple-icons-discord',
        label: 'Ask on Discord',
        to: 'https://discord.gg/Dx6SSkx',
        target: '_blank'
      }, {
        icon: 'i-simple-icons-github',
        label: 'GitHub',
        to: 'https://github.com/syscraft-mc',
        target: '_blank'
      }]
    }
  }
})
