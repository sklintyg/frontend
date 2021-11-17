export interface FMBDiagnosisCodeInfo {
  icd10Code: string
  originalIcd10Code?: string
  icd10Description: string
  originalIcd10Description?: string
  diagnosTitle?: string
  relatedDiagnoses?: string
  referenceDescription?: string
  referenceLink?: string
  forms?: FMBDiagnosisCodeInfoForm[]
  index: number
}

export interface FMBDiagnosisCodeInfoForm {
  name: FMBDiagnosisCodeInfoFormType
  content: FMBDiagnosisCodeInfoFormContent[]
}

export interface FMBDiagnosisCodeInfoFormContent {
  heading: FMBDiagnosisCodeInfoFormContentHeading
  text?: string
  list?: string[]
}

export enum FMBDiagnosisCodeInfoFormType {
  FMB_WORK_CAPACITY = 'ARBETSFORMAGA',
  FMB_DISABILITY = 'FUNKTIONSNEDSATTNING',
  FMB_ACTIVITY_LIMITATION = 'AKTIVITETSBEGRANSNING',
  FMB_REHABILITATION_INFORMATION = 'INFORMATIONOMREHABILITERING',
  FMB_DIAGNOSIS = 'DIAGNOS',
}

export enum FMBDiagnosisCodeInfoFormContentHeading {
  FMB_WORK_CAPACITY = 'ARBETSFORMAGA',
  FMB_DISABILITY = 'FUNKTIONSNEDSATTNING',
  FMB_ACTIVITY_LIMITATION = 'AKTIVITETSBEGRANSNING',
  FMB_REHABILITATION_INFORMATION = 'INFORMATIONOMREHABILITERING',
  FMB_GENERAL_INFO = 'GENERELL_INFO',
  FMB_SYMPTOM_PROGNOSIS_TREATMENT = 'SYMPTOM_PROGNOS_BEHANDLING',
}
