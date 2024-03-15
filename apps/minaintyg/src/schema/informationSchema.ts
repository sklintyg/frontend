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
export const informationSchema = z.object({
  banners: z.array(bannerSchema),
})

export type InformationResponse = z.infer<typeof informationSchema>
export type Banner = z.infer<typeof bannerSchema>
