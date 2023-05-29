import { z } from 'zod'

export const createSickLeaveDTOSchema = z.object({
  careProviderId: z.string(),
  careUnitId: z.string(),
  patientId: z.string(),
  fromDays: z.string(),
  toDays: z.string(),
  doctorId: z.string(),
  relationsId: z.nullable(z.string()),
  relationKod: z.nullable(z.string()),
  diagnosisCode: z.array(z.string()),
  occupation: z.string(),
  workCapacity: z.array(z.string()),
  isSend: z.boolean(),
  isRevoked: z.boolean(),
})
export const unitSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const doctorSchema = z.object({
  hsaId: z.string(),
  name: z.string(),
})

export const patientSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const relationCodeSchema = z.object({
  value: z.string(),
  description: z.string(),
})

export const occupationSchema = z.object({
  code: z.string(),
  description: z.string(),
})

export const workCapacitySchema = z.object({
  code: z.string(),
  description: z.string(),
})
export const testDataOptionsDTOSchema = z.object({
  careProviderIds: z.array(unitSchema),
  careUnitIds: z.array(unitSchema),
  patientIds: z.array(patientSchema),
  doctorIds: z.array(doctorSchema),
  relationCodes: z.array(relationCodeSchema),
  diagnosisCodes: z.array(z.string()),
  occupations: z.array(occupationSchema),
  workCapacity: z.array(workCapacitySchema),
})
export type CreateSickleaveDTO = z.infer<typeof createSickLeaveDTOSchema>
export type TestDataOptionsDTO = z.infer<typeof testDataOptionsDTOSchema>
