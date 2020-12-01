export interface FMBDiagnosisCodeInfo {
  icd10Code: string
  icd10Description: string
  diagnosTitle: string
  relatedDiagnoses: string
  referenceDescription: string
  referenceLink: string
  forms: FMBDiagnosisCodeInfoForm[]
}

export interface FMBDiagnosisCodeInfoForm {
  name: string
  content: FMBDiagnosisCodeInfoFormContent[]
}

export interface FMBDiagnosisCodeInfoFormContent {
  heading: string
  text?: string
  list?: string[]
}
