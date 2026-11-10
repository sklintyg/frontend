import { z } from 'zod'

const bannerTypeEnum = z.enum(['INFO', 'OBSERVE', 'ERROR'])

const bannerSchema = z.object({
  content: z.string(),
  type: bannerTypeEnum,
})

const linkSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
})

const informationSchema = z.object({
  banners: z.array(bannerSchema),
  environment: z.string(),
  links: z.array(linkSchema),
})

export type InformationResponse = z.infer<typeof informationSchema>
