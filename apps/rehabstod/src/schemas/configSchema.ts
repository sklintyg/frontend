import { z } from 'zod'

export enum BannerPriority {
  MEDIUM = 'MEDEL',
  HIGH = 'HOG',
}

const BannerPriorityEnum = z.nativeEnum(BannerPriority)

const bannerSchema = z.object({
  application: z.string(),
  createdAt: z.string(),
  displayFrom: z.string(),
  displayTo: z.string(),
  id: z.string(),
  message: z.string(),
  priority: BannerPriorityEnum,
})

export const configSchema = z.object({
  diagnosKapitelList: z.array(
    z.object({
      from: z.object({
        letter: z.string(),
        number: z.number(),
        id: z.string(),
      }),
      to: z.object({ letter: z.string(), number: z.number(), id: z.string() }),
      name: z.string(),
      id: z.string(),
    })
  ),
  webcertViewIntygTemplateUrl: z.string(),
  webcertViewIntygLogoutUrl: z.string(),
  webcertLaunchUrlTemplate: z.string().nullable(),
  statistikSsoUrl: z.string(),
  version: z.string(),
  banners: z.array(bannerSchema),
  sithsIdpUrl: z.string(),
})

export type Config = z.infer<typeof configSchema>
