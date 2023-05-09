import { z } from 'zod'

export enum TimePeriodMetric {
  DAYS = 'DAYS',
  YEARS = 'YEARS',
}

export const timePeriodOptionSchema = z.object({
  from: z.number().nullable(),
  to: z.number().nullable(),
  metric: z.nativeEnum(TimePeriodMetric),
  id: z.number(),
})

export type TimePeriodOption = z.infer<typeof timePeriodOptionSchema>
