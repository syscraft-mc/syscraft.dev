<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { withoutTrailingSlash } from 'ufo'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const routePath = computed(() => withoutTrailingSlash(route.path))

const { data: page } = await useAsyncData(routePath.value, () => queryCollection('docs').path(routePath.value).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${routePath.value}-surround`, () => {
  return queryCollectionItemSurroundings('docs', routePath.value, {
    fields: ['description']
  })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

useSyscraftSeo({
  title,
  description,
  path: routePath.value,
  eyebrow: headline.value || page.value.section || 'Guide',
  ogType: 'article',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: canonicalUrl(routePath.value),
    isPartOf: {
      '@type': 'WebSite',
      name: 'Syscraft',
      url: useSiteUrl()
    }
  }
})

const hasToc = computed(() => Boolean(page.value?.body?.toc?.links?.length))

const pageUi = {
  root: 'flex flex-col lg:grid lg:grid-cols-[minmax(10rem,12rem)_minmax(0,1fr)_minmax(16rem,20rem)] xl:grid-cols-[minmax(11rem,13rem)_minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-6 xl:gap-8',
  left: 'lg:col-auto min-w-0',
  center: 'lg:col-auto min-w-0',
  right: 'lg:col-auto min-w-0 order-first lg:order-last'
}
</script>

<template>
  <UPage
    v-if="page"
    :ui="pageUi"
  >
    <template #left>
      <UPageAside>
        <UContentNavigation
          highlight
          :navigation="navigation"
        />
      </UPageAside>
    </template>
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
    />

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template #right>
      <UContentToc
        v-if="hasToc"
        highlight
        highlight-variant="circuit"
        :title="toc?.title"
        :links="page.body?.toc?.links"
        :ui="{ linkText: 'truncate' }"
      >
        <template #bottom>
          <PageContributors
            :contributors="page.contributors"
            :updated-at="page.updatedAt"
            :edit-url="page.editUrl"
          />
        </template>
      </UContentToc>
      <aside
        v-else
        class="flex flex-col gap-6 lg:sticky lg:top-(--ui-header-height) py-8"
      >
        <PageContributors
          :contributors="page.contributors"
          :updated-at="page.updatedAt"
          :edit-url="page.editUrl"
        />
      </aside>
    </template>
  </UPage>
</template>
