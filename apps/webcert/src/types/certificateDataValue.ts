// Values

export enum CertificateDataValueType {
  BOOLEAN = 'BOOLEAN',
  CODE = 'CODE',
  CODE_LIST = 'CODE_LIST',
  DATE = 'DATE',
  DATE_LIST = 'DATE_LIST',
  DATE_RANGE = 'DATE_RANGE',
  DATE_RANGE_LIST = 'DATE_RANGE_LIST',
  DIAGNOSIS = 'DIAGNOSIS',
  DIAGNOSIS_LIST = 'DIAGNOSIS_LIST',
  ICF = 'ICF',
  TEXT = 'TEXT',
  DOUBLE = 'DOUBLE',
  UNKNOWN = 'UNKNOWN',
  HEADER = 'HEADER',
  UNCERTAIN_DATE = 'UNCERTAIN_DATE',
  MEDICAL_INVESTIGATION = 'MEDICAL_INVESTIGATION',
  MEDICAL_INVESTIGATION_LIST = 'MEDICAL_INVESTIGATION_LIST',
  CAUSE_OF_DEATH = 'CAUSE_OF_DEATH',
  CAUSE_OF_DEATH_LIST = 'CAUSE_OF_DEATH_LIST',
  VISUAL_ACUITIES = 'VISUAL_ACUITIES',
  VISUAL_ACUITY = 'VISUAL_ACUITY',
  VIEW_TEXT = 'VIEW_TEXT',
  VIEW_LIST = 'VIEW_LIST',
  VIEW_ROW = 'VIEW_ROW',
  VIEW_TABLE = 'VIEW_TABLE',
  YEAR = 'YEAR',
  INTEGER = 'INTEGER',
}

export type ValueType =
  | ValueBoolean
  | ValueCauseOfDeath
  | ValueCauseOfDeathList
  | ValueCode
  | ValueCodeList
  | ValueDate
  | ValueDateList
  | ValueDateRange
  | ValueDateRangeList
  | ValueDiagnosis
  | ValueDiagnosisList
  | ValueDouble
  | ValueHeader
  | ValueIcf
  | ValueText
  | ValueUncertainDate
  | ValueEyeAcuity
  | ValueVisualAcuity
  | ValueMedicalInvestigation
  | ValueMedicalInvestigationList
  | ValueViewText
  | ValueViewList
  | ValueViewTable
  | ValueYear
  | ValueInteger
  | ValueUnknown

export interface ValueUnknown {
  type: CertificateDataValueType.UNKNOWN
}

export interface ValueBoolean {
  type: CertificateDataValueType.BOOLEAN
  id: string
  selected: boolean | null | undefined
}

export interface ValueCode {
  type: CertificateDataValueType.CODE
  id: string
  code: string
}

export interface ValueDate {
  type: CertificateDataValueType.DATE
  id: string
  date?: string
}

export interface ValueDateList {
  type: CertificateDataValueType.DATE_LIST
  list: ValueDate[]
}

export interface ValueDateRange {
  type: CertificateDataValueType.DATE_RANGE
  id: string
  from?: string
  to?: string
}

export interface ValueDateRangeList {
  type: CertificateDataValueType.DATE_RANGE_LIST
  list: ValueDateRange[]
}

export interface ValueDiagnosis {
  type: CertificateDataValueType.DIAGNOSIS
  id: string
  terminology: string
  code: string
  description: string
}

export interface ValueDiagnosisList {
  type: CertificateDataValueType.DIAGNOSIS_LIST
  list: ValueDiagnosis[]
}

export interface ValueCodeList {
  type: CertificateDataValueType.CODE_LIST
  list: ValueCode[]
}

export interface ValueText {
  type: CertificateDataValueType.TEXT
  text: string | null
  id: string
}

export interface ValueDouble {
  type: CertificateDataValueType.DOUBLE
  value: number | null
  id: string
}

export interface ValueUncertainDate {
  type: CertificateDataValueType.UNCERTAIN_DATE
  id: string
  value: string | null
}

export interface ValueCauseOfDeath {
  type: CertificateDataValueType.CAUSE_OF_DEATH
  id: string
  description: ValueText
  debut: ValueDate
  specification: ValueCode
}

export interface ValueCauseOfDeathList {
  type: CertificateDataValueType.CAUSE_OF_DEATH_LIST
  list: ValueCauseOfDeath[]
}

export interface ValueIcf {
  type: CertificateDataValueType.ICF
  id: string
  icfCodes?: string[]
  text: string | null
}

export interface ValueHeader {
  type: CertificateDataValueType.HEADER
  id: string
}

export interface ValueMedicalInvestigation {
  type: CertificateDataValueType.MEDICAL_INVESTIGATION
  investigationType: ValueCode
  date: ValueDate
  informationSource: ValueText
}

export interface ValueMedicalInvestigationList {
  type: CertificateDataValueType.MEDICAL_INVESTIGATION_LIST
  list: ValueMedicalInvestigation[]
}

export interface ValueEyeAcuity {
  type: CertificateDataValueType.VISUAL_ACUITY
  withoutCorrection: ValueDouble
  withCorrection: ValueDouble
  contactLenses?: ValueBoolean
}

export interface ValueVisualAcuity {
  type: CertificateDataValueType.VISUAL_ACUITIES
  rightEye: ValueEyeAcuity
  leftEye: ValueEyeAcuity
  binocular: ValueEyeAcuity
}

export interface ValueViewText {
  type: CertificateDataValueType.VIEW_TEXT
  text: string
}

export interface ValueViewList {
  type: CertificateDataValueType.VIEW_LIST
  list: ValueViewText[]
}

export interface ValueTextRow {
  type: CertificateDataValueType.VIEW_ROW
  columns: ValueText[]
}

export interface ValueViewTable {
  type: CertificateDataValueType.VIEW_TABLE
  rows: ValueTextRow[]
}

export interface ValueYear {
  type: CertificateDataValueType.YEAR
  id: string
  year?: number | string
}

export interface ValueInteger {
  type: CertificateDataValueType.INTEGER
  id: string
  value: number | null
}
