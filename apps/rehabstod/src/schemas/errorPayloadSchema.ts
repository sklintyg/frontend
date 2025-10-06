import { z } from 'zod'

const dataFieldSchema = z.object({
  message: z.string(),
  errorCode: z.string(),
})
const dataSchema = z.object({
  data: dataFieldSchema,
})
const payloadSchema = z.object({
  payload: dataSchema,
})
export const errorPayloadSchema = z.object({
  action: payloadSchema,
})
type ErrorPayloadSchema = z.infer<typeof errorPayloadSchema>
