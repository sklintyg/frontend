import { z } from 'zod'
import { CertificateStatusEnum } from './certificateList.schema'

export const certificateFilterOptionsSchema = z.object({
  total: z.number().optional(),
  statuses: z.array(CertificateStatusEnum),
  units: z.array(z.object({ id: z.string(), name: z.string() })),
  certificateTypes: z.array(z.object({ id: z.string(), name: z.string() })),
  years: z.array(z.string()),
})

type SelectedOptions<T> = { [X in keyof T]: T[X] extends Array<unknown> ? T[X][number] : T[X] }

export type CertificateFilterOptions = z.infer<typeof certificateFilterOptionsSchema>
export type CertificateSelectedOptions = SelectedOptions<CertificateFilterOptions>
