import { z } from 'zod'
import { vardenhetSchema } from './vardenhetSchema'

export const vardgivareSchema = z.object({
  '@class': z.literal('se.inera.intyg.infra.integration.hsatk.model.legacy.Vardgivare'),
  id: z.string(),
  namn: z.string(),
  vardenheter: z.array(vardenhetSchema),
})

export type Vardgivare = z.infer<typeof vardgivareSchema>
