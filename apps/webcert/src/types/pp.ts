export interface HOSPInformation {
  personalPrescriptionCode: string
  licensedHealthcareProfessions: LicensedHealthcareProfession[]
  specialities: Speciality[]
}

export interface LicensedHealthcareProfession {
  code: string
  description: string
}

export interface Speciality {
  code: string
  description: string
}

export interface PPConfig {
  positions: Position[]
  healthcareServiceTypes: HealthcareServiceType[]
  typeOfCare: TypeOfCare[]
}

export interface Position {
  code: string
  description: string
}

export interface HealthcareServiceType {
  code: string
  description: string
}

export interface TypeOfCare {
  code: string
  description: string
}

export type RegisterPrivatePractitionerData = {
  address: string
  careUnitName: string
  city?: string
  county?: string
  email: string
  healthcareServiceType: string
  municipality?: string
  phoneNumber: string
  position: string
  typeOfCare: string
  workplaceCode?: string
  zipCode: string
}
