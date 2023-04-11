import { z } from 'zod'

export const diagnosKategoriSchema = z.object({
  letter: z.string(),
  number: z.number(),
})

export const diagnosKapitelSchema = z.object({
  to: diagnosKategoriSchema,
  from: diagnosKategoriSchema,
  name: z.string(),
  id: z.string(),
})

export type DiagnosKapitel = z.infer<typeof diagnosKapitelSchema>
export type DiagnosKategori = z.infer<typeof diagnosKategoriSchema>
