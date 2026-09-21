<script setup lang="ts">
const { seo } = useAppConfig()

const { data: rawNavigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const navigation = computed(() => groupDocsNavigation(rawNavigation.value))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs', {
  ignoredTags: ['style']
}), {
  server: false
})

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#0ea5e9' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.gif', type: 'image/gif' },
    { rel: 'sitemap', href: '/sitemap.xml', type: 'application/xml' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files || []"
        :navigation="navigation"
        shortcut="meta_k"
        :fuse="{ resultLimit: 20 }"
      />
    </ClientOnly>
  </UApp>
</template>
