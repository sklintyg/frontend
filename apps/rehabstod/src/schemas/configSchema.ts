import { z } from 'zod'

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
  banners: z.array(z.unknown()),
})

export type Config = z.infer<typeof configSchema>