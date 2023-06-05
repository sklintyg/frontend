import { nullable, z } from 'zod'

export const errorSchema = z.object({
  errorId: z.string(),
  errorCode: z.string(),
  message: z.string(),
  stackTrace: nullable(z.string()),
})
export type ErrorData = z.infer<typeof errorSchema>
