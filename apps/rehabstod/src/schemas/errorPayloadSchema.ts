import { z } from 'zod'

export const dataFieldSchema = z.object({
  message: z.string(),
  errorCode: z.string(),
})
export const dataSchema = z.object({
  data: dataFieldSchema,
})
export const payloadSchema = z.object({
  payload: dataSchema,
})
export const errorPayloadSchema = z.object({
  action: payloadSchema,
})
export type ErrorPayloadSchema = z.infer<typeof errorPayloadSchema>
