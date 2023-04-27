import { z } from 'zod'

const tableColumnSchema = z.object({
  name: z.string(),
  visible: z.boolean(),
  disabled: z.boolean(),
  index: z.number(),
})

export type TableColumn = z.infer<typeof tableColumnSchema>
