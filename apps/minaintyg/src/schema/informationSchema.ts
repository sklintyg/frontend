import { z } from 'zod'

export enum BannerPriority {
  INFO = 'INFO',
  OBSERVE = 'OBSERVE',
  ERROR = 'ERROR',
}

export const bannerTypeEnum = z.nativeEnum(BannerPriority)

export const bannerSchema = z.object({
  content: z.string(),
  type: bannerTypeEnum,
})

export const linkSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
})

export const informationSchema = z.object({
  banners: z.array(bannerSchema),
  environment: z.string(),
  links: z.array(linkSchema),
})

export type InformationResponse = z.infer<typeof informationSchema>
export type Banner = z.infer<typeof bannerSchema>