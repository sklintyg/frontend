import { z } from 'zod'
import { vardenheterSchema } from './vardenheterSchema'
import { vardgivareSchema } from './vardgivareSchema'

export const preferencesSchema = z.object({
  lakarutlatandeUnitTableColumns: z.string(),
  pdlConsentGiven: z.string(),
  patientTableColumns: z.string(),
  sjukfallTableColumns: z.string(),
  lakarutlatandenTableColumns: z.string(),
  maxAntalDagarSedanSjukfallAvslut: z.string(),
  standardenhet: z.null(),
  maxAntalDagarMellanIntyg: z.string(),
})

export const srsFeatureSchema = z.object({
  name: z.string(),
  desc: z.string(),
  global: z.boolean(),
  intygstyper: z.array(z.unknown()),
})

export const lakareRoleSchema = z.object({
  name: z.string(),
  desc: z.string(),
  privileges: z.array(z.string()),
})

export const roleSchema = z.object({
  LAKARE: lakareRoleSchema,
})

export const featureSchema = z.object({
  SRS: srsFeatureSchema,
})

export const userSchema = z.object({
  hsaId: z.string(),
  namn: z.string(),
  titel: z.string(),
  authenticationScheme: z.string(),
  vardgivare: z.array(vardgivareSchema),
  befattningar: z.array(z.string()),
  valdVardenhet: vardenheterSchema.nullable(),
  valdVardgivare: vardgivareSchema.nullable(),
  roles: roleSchema,
  totaltAntalVardenheter: z.number(),
  urval: z.string(),
  pdlConsentGiven: z.boolean(),
  roleSwitchPossible: z.boolean(),
  features: featureSchema,
  preferences: preferencesSchema,
})

export type Preferences = z.infer<typeof preferencesSchema>
export type SrsFeature = z.infer<typeof srsFeatureSchema>
export type LakareRole = z.infer<typeof lakareRoleSchema>
export type Role = z.infer<typeof roleSchema>
export type Feature = z.infer<typeof featureSchema>
export type User = z.infer<typeof userSchema>
