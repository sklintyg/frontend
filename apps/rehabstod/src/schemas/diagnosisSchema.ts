import { z } from 'zod'

const diagnosKategoriSchema = z.object({
  letter: z.string(),
  number: z.number(),
})

export const diagnosKapitelSchema = z.object({
  to: diagnosKategoriSchema,
  from: diagnosKategoriSchema,
  name: z.string(),
  id: z.string(),
})

const diagnosGruppSchema = z.object({
  id: z.string(),
  name: z.string(),
  kapitelList: z.array(diagnosKapitelSchema),
})

export const diagnosGruppStatSchema = z.object({
  grupp: diagnosGruppSchema,
  count: z.number(),
  percentage: z.number(),
})

export const diagnosisSchema = z.object({
  beskrivning: z.string().optional(),
  intygsVarde: z.string(),
  kapitel: z.string(),
  kod: z.string(),
  namn: z.string(),
})

export type DiagnosKapitel = z.infer<typeof diagnosKapitelSchema>
export type DiagnosGruppStat = z.infer<typeof diagnosGruppStatSchema>
export type Diagnosis = z.infer<typeof diagnosisSchema>
