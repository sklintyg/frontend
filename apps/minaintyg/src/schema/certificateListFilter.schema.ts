import { z } from 'zod'
import { CertificateStatus } from './certificateList.schema'

export const certificateFilterOptionsSchema = z.object({
  total: z.number(),
  statuses: z.array(z.nativeEnum(CertificateStatus)),
  units: z.array(z.string()),
  certificateTypes: z.array(z.string()),
  years: z.array(z.string()),
})

type SelectedOptions<T> = { [X in keyof T]: T[X] extends Array<unknown> ? T[X][number] : T[X] }

export type CertificateFilterOptions = z.infer<typeof certificateFilterOptionsSchema>
export type CertificateSelectedOptions = SelectedOptions<CertificateFilterOptions>
