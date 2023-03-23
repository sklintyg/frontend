import { z } from 'zod'
import { vardenheterSchema } from './vardenheterSchema'

export const vardgivareSchema = z.object({
  '@class': z.literal('se.inera.intyg.infra.integration.hsatk.model.legacy.Vardgivare'),
  id: z.string(),
  namn: z.string(),
  vardenheter: z.array(vardenheterSchema),
})

export type Vardgivare = z.infer<typeof vardgivareSchema>
