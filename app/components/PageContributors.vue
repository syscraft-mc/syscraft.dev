<script setup lang="ts">
const props = defineProps<{
  contributors?: {
    name: string
    username?: string
    avatar?: string
  }[]
  updatedAt?: string
  editUrl?: string
}>()

const MAX_VISIBLE = 7

const people = computed(() => props.contributors?.filter(person => person.name) ?? [])

const formatted = computed(() => {
  if (!props.updatedAt) {
    return ''
  }
  const date = new Date(props.updatedAt)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium' }).format(date)
})

const show = computed(() => people.value.length > 0 || !!formatted.value || !!props.editUrl)

function profileUrl(username?: string) {
  return username ? `https://github.com/${username}` : undefined
}
</script>

<template>
  <UPageCard
    v-if="show"
    variant="soft"
    :ui="{
      root: 'overflow-hidden',
      container: 'gap-0 p-0 sm:p-0',
      wrapper: 'hidden',
      body: 'w-full'
    }"
  >
    <div class="flex w-full flex-col divide-y divide-default">
      <section v-if="people.length" class="p-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <p class="text-base font-semibold text-highlighted">
            Contributors
          </p>
          <UBadge color="neutral" variant="outline" class="tabular-nums">
            {{ people.length }}
          </UBadge>
        </div>
        <UAvatarGroup :max="MAX_VISIBLE" size="lg">
          <UTooltip
            v-for="person in people"
            :key="person.username || person.name"
            :text="person.name"
          >
            <ULink
              v-if="profileUrl(person.username)"
              :to="profileUrl(person.username)"
              target="_blank"
              external
              :aria-label="`${person.name} on GitHub`"
              class="rounded-full hover:ring-primary transition"
              raw
            >
              <UAvatar
                :src="person.avatar"
                :alt="person.name"
                loading="eager"
                referrerpolicy="no-referrer"
              />
            </ULink>
            <UAvatar
              v-else
              :src="person.avatar"
              :alt="person.name"
              loading="eager"
              referrerpolicy="no-referrer"
            />
          </UTooltip>
        </UAvatarGroup>
      </section>

      <section
        v-if="formatted || editUrl"
        class="flex items-center justify-between gap-3 p-4"
      >
        <div v-if="formatted">
          <p class="font-semibold text-highlighted whitespace-nowrap">
            Last updated
          </p>
          <time class="mt-0.5 block text-sm text-muted whitespace-nowrap" :datetime="updatedAt">
            {{ formatted }}
          </time>
        </div>
        <UButton
          v-if="editUrl"
          :to="editUrl"
          target="_blank"
          external
          color="neutral"
          variant="soft"
          icon="i-lucide-pencil"
          class="ms-auto shrink-0"
        >
          Edit this page
        </UButton>
      </section>
    </div>
  </UPageCard>
</template>
