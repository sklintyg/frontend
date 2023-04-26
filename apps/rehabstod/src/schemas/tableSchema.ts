import { z } from 'zod'

const tableColumnSchema = z.object({
  name: z.string(),
  visible: z.boolean(),
  disabled: z.boolean(),
})

export type TableColumn = z.infer<typeof tableColumnSchema>
