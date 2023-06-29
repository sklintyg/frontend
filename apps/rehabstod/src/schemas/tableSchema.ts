import { z } from 'zod'

export const tableColumnSchema = z.object({
  name: z.string(),
  visible: z.boolean(),
  disabled: z.boolean(),
  index: z.number(),
})

export type TableColumn = z.infer<typeof tableColumnSchema>
