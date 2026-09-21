<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: docs } = await useAsyncData('home-guides', () => queryCollection('docs').all())

const title = page.value.seo?.title || page.value.title || 'Syscraft'
const description = page.value.seo?.description || page.value.description || 'A community for Minecraft server admins, developers, and hosts.'
const siteUrl = useSiteUrl()

const guideSections = computed(() => {
  const pages = docs.value || []
  return GUIDE_SECTIONS.map(section => ({
    ...section,
    guides: section.paths.map((path) => {
      const doc = pages.find(item => item.path === path)
      return {
        path,
        title: navTitleFor(path, doc?.title),
        description: doc?.description || '',
        icon: GUIDE_ICONS[path]
      }
    })
  }))
})

useSyscraftSeo({
  title,
  description,
  path: '/',
  titleTemplate: '',
  eyebrow: 'Community wiki',
  jsonLd: [
    {
      '@type': 'Organization',
      name: 'Syscraft',
      url: `${siteUrl}/`,
      logo: `${siteUrl}/syscraft-logo.png`,
      sameAs: [
        'https://discord.gg/Dx6SSkx',
        'https://reddit.com/r/syscraft',
        'https://github.com/syscraft-mc'
      ]
    },
    {
      '@type': 'WebSite',
      name: 'Syscraft',
      url: `${siteUrl}/`,
      description
    }
  ]
})

const sectionUi = {
  container: 'py-12 sm:py-16 lg:py-20 gap-8 sm:gap-10',
  body: 'mt-10'
}
</script>

<template>
  <div>
    <UPageHero
      headline="Minecraft server community"
      description="Guides and a Discord for admins, plugin developers, and hosts — from a first Paper box with friends to a network that stays at 20 TPS."
      orientation="vertical"
      :ui="{
        root: 'relative overflow-hidden',
        container: 'py-16 sm:py-20 lg:py-24 gap-10',
        title: 'text-5xl sm:text-7xl lg:text-8xl text-pretty tracking-tight font-bold text-highlighted',
        description: 'mt-6 text-lg sm:text-xl/8 text-muted text-pretty max-w-2xl mx-auto',
        links: 'justify-center'
      }"
    >
      <template #top>
        <HeroBackground />
        <StarsBg />
      </template>

      <template #title>
        <span class="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
          <span class="relative">
            <span class="absolute inset-0 rounded-full bg-primary/30 blur-3xl" />
            <img
              src="/syscraft-logo.gif"
              alt=""
              width="160"
              height="160"
              class="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40"
            >
          </span>
          <span class="font-mono uppercase tracking-[0.04em]">
            Syscraft
          </span>
        </span>
      </template>

      <template #links>
        <UButton
          to="/starter-server"
          size="xl"
          trailing-icon="i-lucide-arrow-right"
        >
          Browse the guides
        </UButton>
        <UButton
          to="https://discord.gg/Dx6SSkx"
          target="_blank"
          icon="i-simple-icons-discord"
          color="neutral"
          variant="outline"
          size="xl"
        >
          Join Discord
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="Start with a guide"
      description="If you are new to hosting, skim each guide in order. Search (⌘K / Ctrl+K) if you already know what you need."
      :ui="sectionUi"
    >
      <template #body>
        <div class="space-y-10">
          <div
            v-for="section in guideSections"
            :key="section.title"
          >
            <h2 class="text-lg font-semibold text-highlighted">
              {{ section.title }}
            </h2>
            <p class="mt-1 text-sm text-muted">
              {{ section.description }}
            </p>
            <UPageGrid class="mt-4">
              <UPageCard
                v-for="guide in section.guides"
                :key="guide.path"
                :to="guide.path"
                :icon="guide.icon"
                :title="guide.title"
                :description="guide.description"
                variant="subtle"
                spotlight
              />
            </UPageGrid>
          </div>
        </div>
      </template>
    </UPageSection>

    <UPageSection
      title="Join the community"
      description="Need help, want to stay current, or just hang out with other people who run Minecraft servers?"
      :ui="sectionUi"
    >
      <template #body>
        <UPageGrid>
          <UPageCard
            icon="i-simple-icons-discord"
            title="Discord"
            description="The home of Syscraft — help for server admins, plugin developers, and hosts."
            to="https://discord.gg/Dx6SSkx"
            target="_blank"
            variant="outline"
            spotlight
          />
          <UPageCard
            icon="i-simple-icons-reddit"
            title="Reddit"
            description="r/syscraft for longer-form discussion."
            to="https://reddit.com/r/syscraft"
            target="_blank"
            variant="outline"
            spotlight
          />
          <UPageCard
            icon="i-simple-icons-github"
            title="GitHub"
            description="Wiki, Discord tags bot, and starter server."
            to="https://github.com/syscraft-mc"
            target="_blank"
            variant="outline"
            spotlight
          />
        </UPageGrid>
      </template>
    </UPageSection>

    <UPageSection
      title="Contribute"
      description="Issues, improvements, and new guides are welcome. If you are unsure where to start, ask on Discord."
      :ui="sectionUi"
    >
      <template #body>
        <UPageGrid>
          <UPageCard
            icon="i-lucide-book-open"
            title="This wiki"
            description="Create or update guides in Markdown."
            to="https://github.com/syscraft-mc/syscraft.dev"
            target="_blank"
            variant="subtle"
          />
          <UPageCard
            icon="i-lucide-bot"
            title="Discord tags"
            description="Commands for the @Syscraft bot."
            to="https://github.com/syscraft-mc/tags"
            target="_blank"
            variant="subtle"
          />
          <UPageCard
            icon="i-lucide-server"
            title="Starter Server"
            description="A basic Java Edition server to help people get started."
            to="https://github.com/syscraft-mc/starter-server"
            target="_blank"
            variant="subtle"
          />
        </UPageGrid>
      </template>
    </UPageSection>
  </div>
</template>
