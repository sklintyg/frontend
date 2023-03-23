import { z } from 'zod'
import { AgandeFormEnum } from './enums'
import { mottagningSchema } from './mottagningSchema'

export const vardenheterSchema = z.object({
  '@class': z.literal('se.inera.intyg.infra.integration.hsatk.model.legacy.Vardenhet'),
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
  mottagningar: z.array(mottagningSchema).optional(),
  parentHsaId: z.string().optional(),
})

export type Vardenheter = z.infer<typeof vardenheterSchema>
