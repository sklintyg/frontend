// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod'

export const dynamicLinkSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
})

export type DynamicLink = z.infer<typeof dynamicLinkSchema>
