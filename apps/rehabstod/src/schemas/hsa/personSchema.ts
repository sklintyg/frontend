import { z } from 'zod'
import { AllowedInApplicationEnum, EnvEnum, HealthCareProfessionalLicenceEnum } from './enums'

const extraContextPropertiesSchema = z.object({
  pdlConsentGiven: z.string().optional(),
})

const loginSchema = z.object({
  forvaldEnhet: z.string(),
  beskrivning: z.string(),
})

const healthCareProfessionalLicenceTypeSchema = z.object({
  healthCareProfessionalLicenceCode: z.string(),
  healthCareProfessionalLicenceName: z.string(),
})

const paTitleSchema = z.object({
  titleCode: z.string(),
  titleName: z.string(),
})

const specialitySchema = z.object({
  specialityName: z.string(),
  specialityCode: z.string(),
})

const fakePropertiesSchema = z.object({
  displayOrder: z.string().nullable(),
  env: EnvEnum.nullable(),
  readOnly: z.boolean(),
  allowedInApplications: z.array(AllowedInApplicationEnum),
  logins: z.array(loginSchema),
  extraContextProperties: extraContextPropertiesSchema,
})

const restrictionSchema = z.object({
  restrictionCode: z.string(),
  restrictionName: z.string(),
})

export const personSchema = z.object({
  hsaId: z.string().nullable(),
  personalIdentityNumber: z.string().nullable(),
  givenName: z.string().nullable(),
  middleAndSurname: z.string().nullable(),
  protectedPerson: z.boolean(),
  specialities: z.array(specialitySchema),
  unitIds: z.array(z.string()),
  title: z.null(),
  healthCareProfessionalLicence: z.array(HealthCareProfessionalLicenceEnum),
  paTitle: z.array(paTitleSchema).nullable(),
  personalPrescriptionCode: z.string().nullable(),
  systemRoles: z.array(z.string()).nullable(),
  educationCodes: z.array(z.string()).nullable(),
  restrictions: z.array(restrictionSchema).nullable(),
  fakeProperties: fakePropertiesSchema.nullable(),
  gender: z.null(),
  age: z.null(),
  healthCareProfessionalLicenceType: z.array(healthCareProfessionalLicenceTypeSchema),
})

type ExtraContextProperties = z.infer<typeof extraContextPropertiesSchema>
type Login = z.infer<typeof loginSchema>
type HealthCareProfessionalLicenceType = z.infer<typeof healthCareProfessionalLicenceTypeSchema>
type PaTitle = z.infer<typeof paTitleSchema>
type Speciality = z.infer<typeof specialitySchema>
type FakeProperties = z.infer<typeof fakePropertiesSchema>
type Restriction = z.infer<typeof restrictionSchema>
export type Person = z.infer<typeof personSchema>
