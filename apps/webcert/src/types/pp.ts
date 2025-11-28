export interface HOSPInformation {
  personalPrescriptionCode: string
  licensedHealthcareProfessions: LicensedHealthcareProfession[]
  specialities: Speciality[]
}

interface LicensedHealthcareProfession {
  code: string
  description: string
}

interface Speciality {
  code: string
  description: string
}

export interface PPConfig {
  positions: Position[]
  healthcareServiceTypes: HealthcareServiceType[]
  typeOfCare: TypeOfCare[]
}

interface Position {
  code: string
  description: string
}

interface HealthcareServiceType {
  code: string
  description: string
}

interface TypeOfCare {
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
