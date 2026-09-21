import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    docs: defineCollection({
      type: 'page',
      source: {
        include: '*.md',
        exclude: ['index.md']
      },
      schema: z.object({
        section: z.string().optional(),
        updatedAt: z.string().optional(),
        editUrl: z.string().optional(),
        contributors: z.array(z.object({
          name: z.string(),
          username: z.string().optional(),
          avatar: z.string().optional()
        })).optional(),
        links: z.array(z.object({
          label: z.string(),
          icon: z.string(),
          to: z.string(),
          target: z.string().optional()
        })).optional()
      })
    })
  }
})
