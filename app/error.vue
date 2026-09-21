<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSyscraftSeo({
  title: 'Page not found',
  description: 'This page could not be found.',
  path: '/404',
  noIndex: true,
  eyebrow: 'Error'
})

const { data: rawNavigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const navigation = computed(() => groupDocsNavigation(rawNavigation.value))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files || []"
        :navigation="navigation"
        shortcut="meta_k"
      />
    </ClientOnly>
  </UApp>
</template>
