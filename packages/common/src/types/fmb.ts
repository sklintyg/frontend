export interface FMBDiagnosisCodeInfo {
  icd10Code: string
  icd10Description: string
  diagnosTitle: string
  relatedDiagnoses: string
  referenceDescription: string
  referenceLink: string
  forms: FMBDiagnosisCodeInfoForm[]
  index: number
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

export const FMB_WORK_CAPACITY = 'ARBETSFORMAGA'
export const FMB_DISABILITY = 'FUNKTIONSNEDSATTNING'
export const FMB_ACTIVITY_LIMITATION = 'AKTIVITETSBEGRANSNING'
export const FMB_REHABILITATION_INFORMATION = 'INFORMATIONOMREHABILITERING'
export const FMB_DIAGNOSIS = 'DIAGNOS'
export const FMB_GENERAL_INFO = 'GENERELL_INFO'
export const FMB_SYMPTOM_PROGNOSIS_TREATMENT = 'SYMPTOM_PROGNOS_BEHANDLING'
