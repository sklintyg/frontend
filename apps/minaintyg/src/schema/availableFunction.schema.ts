import { z } from 'zod'

export const AvailableFunctionType = z.enum(['SEND_CERTIFICATE'])
export const AvailableFunctionInformationType = z.enum([''])

export const availableFunctionInformationSchema = z.object({
  type: AvailableFunctionInformationType,
  id: z.string(),
})

export const availableFunctionSchema = z.object({
  body: z.string().nullable(),
  description: z.string().nullable(),
  name: z.string().nullable(),
  title: z.string().nullable(),
  type: AvailableFunctionType,
  information: z.array(availableFunctionInformationSchema),
})

export type AvailableFunction = z.infer<typeof availableFunctionSchema>
