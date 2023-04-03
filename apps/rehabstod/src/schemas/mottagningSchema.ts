import { z } from 'zod'
import { AgandeFormEnum } from './enums'

export const mottagningSchema = z.object({
  '@class': z.literal('se.inera.intyg.infra.integration.hsatk.model.legacy.Mottagning'),
  id: z.string(),
  namn: z.string(),
  epost: z.string().nullable(),
  postadress: z.string().nullable(),
  postnummer: z.string().nullable(),
  postort: z.string().nullable(),
  telefonnummer: z.string(),
  arbetsplatskod: z.string(),
  vardgivareOrgnr: z.record(z.string()).nullable(),
  agandeForm: AgandeFormEnum,
  start: z.date().nullable(),
  end: z.null(),
  vardgivareHsaId: z.string().optional(),
  parentHsaId: z.string().optional(),
})

export type Mottagning = z.infer<typeof mottagningSchema>
