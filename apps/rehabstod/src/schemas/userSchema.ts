import { z } from 'zod'
import { vardenhetSchema } from './vardenhetSchema'
import { vardgivareSchema } from './vardgivareSchema'

export const DAYS_BETWEEN_SICK_LEAVES = {
  MIN: 0,
  MAX: 90,
}
export const DAYS_FINISHED_SICK_LEAVE = {
  MIN: 0,
  MAX: 14,
}

export const userPreferencesSchema = z.object({
  lakarutlatandeUnitTableColumns: z.string(),
  pdlConsentGiven: z.string(),
  patientTableColumns: z.string(),
  sjukfallTableColumns: z.string(),
  lakarutlatandenTableColumns: z.string(),
  maxAntalDagarSedanSjukfallAvslut: z.string(),
  standardenhet: z.nullable(z.string()),
  maxAntalDagarMellanIntyg: z.string(),
})

export const srsFeatureSchema = z.object({
  name: z.string(),
  desc: z.string(),
  global: z.boolean(),
  intygstyper: z.array(z.unknown()),
})

const lakareRoleSchema = z.object({
  name: z.string(),
  desc: z.string(),
  privileges: z.array(z.string()),
})

const userRoleSchema = z.object({
  LAKARE: lakareRoleSchema,
})

const userFeatureSchema = z
  .object({
    SRS: srsFeatureSchema,
  })
  .partial()

export const userSchema = z.object({
  hsaId: z.string(),
  namn: z.string(),
  titel: z.string(),
  authenticationScheme: z.string(),
  vardgivare: z.array(vardgivareSchema),
  befattningar: z.array(z.string()),
  valdVardenhet: vardenhetSchema.nullable(),
  valdVardgivare: vardgivareSchema.nullable(),
  roles: userRoleSchema,
  totaltAntalVardenheter: z.number(),
  urval: z.string(),
  pdlConsentGiven: z.boolean(),
  roleSwitchPossible: z.boolean(),
  features: userFeatureSchema,
  preferences: userPreferencesSchema,
})

export enum UserUrval {
  ISSUED_BY_ME = 'ISSUED_BY_ME',
}

export type UserPreferences = z.infer<typeof userPreferencesSchema>
type UserPreferencesTableSettings =
  | 'lakarutlatandeUnitTableColumns'
  | 'patientTableColumns'
  | 'sjukfallTableColumns'
  | 'lakarutlatandenTableColumns'
type SrsFeature = z.infer<typeof srsFeatureSchema>
type LakareRole = z.infer<typeof lakareRoleSchema>
type UserRole = z.infer<typeof userRoleSchema>
type UserFeature = z.infer<typeof userFeatureSchema>
export type User = z.infer<typeof userSchema>
