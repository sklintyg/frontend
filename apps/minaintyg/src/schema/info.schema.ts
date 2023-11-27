import { z } from 'zod'

export enum BannerPriority {
  ERROR = 'ERROR',
  OBSERVE = 'OBSERVE',
  INFO = 'INFO',
}

export const bannerTypeEnum = z.nativeEnum(BannerPriority)

export const bannerSchema = z.object({
  content: z.string(),
  type: bannerTypeEnum,
})
export const infoSchema = z.object({
  banners: z.array(bannerSchema),
})

export type Info = z.infer<typeof infoSchema>
export type Banner = z.infer<typeof bannerSchema>
