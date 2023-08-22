import { z } from 'zod'

export const appConfigLinkSchema = z.object({
  key: z.string(),
  url: z.string(),
  text: z.string(),
  target: z.string(),
})

export const appConfigSchema = z.object({
  useMinifiedJavascript: z.boolean(),
  version: z.string(),
  buildNumber: z.string(),
  elva77MainUrl: z.string(),
  elva77LoginUrl: z.string(),
  applicationLogoutUrl: z.string(),
  miUserSurveyUrl: z.string(),
  miUserSurveyVersion: z.string(),
  miUserSurveyDateFrom: z.string(),
  miUserSurveyDateTo: z.string(),
  knownRecipients: z.array(z.object({ id: z.string(), name: z.string(), trusted: z.boolean() })),
  links: z.record(appConfigLinkSchema),
  banners: z.array(z.unknown()),
})

export type AppConfig = z.infer<typeof appConfigSchema>
export type AppConfigLink = z.infer<typeof appConfigLinkSchema>
