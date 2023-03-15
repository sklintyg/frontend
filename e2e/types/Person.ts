export interface Person {
  hsaId: null | string
  personalIdentityNumber: null | string
  givenName: null | string
  middleAndSurname: null | string
  protectedPerson: boolean
  specialities: Speciality[]
  unitIds: string[]
  title: null
  healthCareProfessionalLicence: HealthCareProfessionalLicence[]
  paTitle: PaTitle[] | null
  personalPrescriptionCode: null | string
  systemRoles: string[] | null
  educationCodes: EducationCode[] | null
  restrictions: Restriction[] | null
  fakeProperties: FakeProperties | null
  gender: null
  age: null
  healthCareProfessionalLicenceType: HealthCareProfessionalLicenceType[]
}

export enum EducationCode {
  EducationCode1 = 'educationCode1',
  EducationCode2 = 'educationCode2',
}

export interface FakeProperties {
  displayOrder: null | string
  env: Env | null
  readOnly: boolean
  allowedInApplications: AllowedInApplication[]
  logins: Login[]
  extraContextProperties: ExtraContextProperties
}

export enum AllowedInApplication {
  Ib = 'IB',
  Rs = 'RS',
  Wc = 'WC',
}

export enum Env {
  Demo = 'demo',
  Dev = 'dev',
}

export interface ExtraContextProperties {
  pdlConsentGiven?: string
}

export interface Login {
  forvaldEnhet: string
  beskrivning: string
}

export enum HealthCareProfessionalLicence {
  Läkare = 'Läkare',
  Tandläkare = 'Tandläkare',
}

export interface HealthCareProfessionalLicenceType {
  healthCareProfessionalLicenceCode: string
  healthCareProfessionalLicenceName: string
}

export interface PaTitle {
  titleCode: string
  titleName: string
}

export interface Restriction {
  restrictionCode: RestrictionCode
  restrictionName: RestrictionName
}

export enum RestrictionCode {
  RestrictionCode1 = 'restrictionCode1',
  RestrictionCode2 = 'restrictionCode2',
}

export enum RestrictionName {
  Restriction1 = 'restriction1',
  Restriction2 = 'restriction2',
}

export interface Speciality {
  specialityName: string
  specialityCode: string
}
