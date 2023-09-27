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

export const diagnosGruppSchema = z.object({
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
  beskrivning: z.nullable(z.string()),
  intygsVarde: z.string(),
  kapitel: z.string(),
  kod: z.string(),
  namn: z.string(),
})

export type DiagnosKapitel = z.infer<typeof diagnosKapitelSchema>
export type DiagnosKategori = z.infer<typeof diagnosKategoriSchema>
export type DiagnosGrupp = z.infer<typeof diagnosGruppSchema>
export type DiagnosGruppStat = z.infer<typeof diagnosGruppStatSchema>
export type Diagnosis = z.infer<typeof diagnosisSchema>
