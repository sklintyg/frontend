export enum ConfigTypes {
  CATEGORY = 'CATEGORY',
  UE_CHECKBOX_BOOLEAN = 'UE_CHECKBOX_BOOLEAN',
  UE_CHECKBOX_CODE = 'UE_CHECKBOX_CODE',
  UE_CHECKBOX_DATE = 'UE_CHECKBOX_DATE',
  UE_CHECKBOX_MULTIPLE_CODE = 'UE_CHECKBOX_MULTIPLE_CODE',
  UE_CHECKBOX_MULTIPLE_DATE = 'UE_CHECKBOX_MULTIPLE_DATE',
  UE_CHECKBOX_MULTIPLE_DATE_RANGE = 'UE_CHECKBOX_MULTIPLE_DATE_RANGE',
  UE_DATE = 'UE_DATE',
  UE_DATE_RANGE = 'UE_DATE_RANGE',
  UE_DIAGNOSES = 'UE_DIAGNOSES',
  UE_DROPDOWN = 'UE_DROPDOWN',
  UE_RADIO_BOOLEAN = 'UE_RADIO_BOOLEAN',
  UE_RADIO_CODE = 'UE_RADIO_CODE',
  UE_RADIO_MULTIPLE_CODE = 'UE_RADIO_MULTIPLE_CODE',
  UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN = 'UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN',
  UE_CHECKBOX_DATE_RANGE_LIST = 'UE_CHECKBOX_DATE_RANGE_LIST',
  UE_TEXTAREA = 'UE_TEXTAREA',
  UE_ICF = 'UE_ICF',
  UE_UNCERTAIN_DATE = 'UE_UNCERTAIN_DATE',
  UE_TEXTFIELD = 'UE_TEXTFIELD',
  UE_TYPE_AHEAD = 'UE_TYPE_AHEAD',
  UE_MESSAGE = 'UE_MESSAGE',
  UE_HEADER = 'UE_HEADER',
  UE_MEDICAL_INVESTIGATION = 'UE_MEDICAL_INVESTIGATION',
  UE_CAUSE_OF_DEATH = 'UE_CAUSE_OF_DEATH',
  UE_CAUSE_OF_DEATH_LIST = 'UE_CAUSE_OF_DEATH_LIST',
  UE_VISUAL_ACUITY = 'UE_VISUAL_ACUITY',
  UE_VIEW_TEXT = 'UE_VIEW_TEXT',
  UE_VIEW_LIST = 'UE_VIEW_LIST',
  UE_VIEW_TABLE = 'UE_VIEW_TABLE',
  UE_YEAR = 'UE_YEAR',
  UE_INTEGER = 'UE_INTEGER',
}

export type CertificateDataConfigType =
  | ConfigCategory
  | ConfigUeCauseOfDeath
  | ConfigUeCauseOfDeathList
  | ConfigUeCheckboxBoolean
  | ConfigUeCheckboxDate
  | ConfigUeCheckboxDateRange
  | ConfigUeCheckboxDateRangeList
  | ConfigUeCheckboxMultipleCodes
  | ConfigUeCheckboxMultipleDate
  | ConfigUeDate
  | ConfigUeDateRange
  | ConfigUeDiagnoses
  | ConfigUeDropdown
  | ConfigUeHeader
  | ConfigUeIcf
  | ConfigUeInteger
  | ConfigUeMedicalInvestigationList
  | ConfigUeMessage
  | ConfigUeRadioBoolean
  | ConfigUeRadioCode
  | ConfigUeRadioMultipleCodes
  | ConfigUeRadioMultipleCodesOptionalDropdown
  | ConfigUeTextArea
  | ConfigUeTextField
  | ConfigUeTypeahead
  | ConfigUeUncertainDate
  | ConfigUeViewList
  | ConfigUeViewTable
  | ConfigUeViewText
  | ConfigUeVisualAcuity
  | ConfigUeYear

export enum MessageLevel {
  INFO = 'INFO',
  OBSERVE = 'OBSERVE',
  ERROR = 'ERROR',
}

export interface ConfigMessage {
  level: MessageLevel
  content: string
}

export interface CertificateDataConfig {
  header?: string
  icon?: string
  text: string
  label?: string
  description: string
  type: ConfigTypes
  accordion?: ConfigAccordion
  list?: unknown
  message?: ConfigMessage
}

export interface ConfigAccordion {
  openText: string
  closeText: string
  header?: string
}

export interface ConfigCategory extends CertificateDataConfig {
  type: ConfigTypes.CATEGORY
}

export interface ConfigUeTextArea extends CertificateDataConfig {
  type: ConfigTypes.UE_TEXTAREA
  id: string
  label?: string
}

export interface ConfigUeTextField extends CertificateDataConfig {
  type: ConfigTypes.UE_TEXTFIELD
  id: string
}

export interface ConfigUeRadioBoolean extends CertificateDataConfig {
  type: ConfigTypes.UE_RADIO_BOOLEAN
  id: string
  selectedText: string
  unselectedText: string
}

export interface ConfigUeCheckboxBoolean extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_BOOLEAN
  id: string
  label: string
  selectedText: string
  unselectedText: string
}

export interface ConfigUeMessage extends CertificateDataConfig {
  type: ConfigTypes.UE_MESSAGE
  id: string
  message: ConfigMessage
}

export interface ConfigUeTypeahead extends CertificateDataConfig {
  type: ConfigTypes.UE_TYPE_AHEAD
  id: string
  typeAhead: string[]
  text: string
  label: string
  placeholder?: string
}

export interface CheckboxCode {
  id: string
  label: string
  disabled?: boolean
}

export enum ConfigLayout {
  ROWS = 'ROWS',
  INLINE = 'INLINE',
  COLUMN = 'COLUMN',
  COLUMNS = 'COLUMNS',
}

export interface ConfigUeCheckboxMultipleCodes extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE
  list: CheckboxCode[]
  layout: ConfigLayout
}

export interface ConfigUeRadioCode extends CertificateDataConfig {
  type: ConfigTypes.UE_RADIO_CODE
  id: string
  label: string
}

export interface ConfigUeRadioCodeOptionalDropdown {
  id: string
  label: string
  dropdownQuestionId: string
}

export interface ConfigUeRadioMultipleCodes extends CertificateDataConfig {
  type: ConfigTypes.UE_RADIO_MULTIPLE_CODE
  id: string
  list: ConfigUeRadioCode[]
  layout: ConfigLayout
}

export interface ConfigUeRadioMultipleCodesOptionalDropdown extends CertificateDataConfig {
  type: ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN
  id: string
  list: ConfigUeRadioCodeOptionalDropdown[]
}

export interface ConfigUeCheckboxDate extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_DATE
  id: string
  label: string
  maxDate?: string
  minDate?: string
}

export interface ConfigUeCheckboxDateRange extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE_RANGE
  id: string
  label: string
}

export interface ConfigUeCheckboxMultipleDate extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE
  list: ConfigUeCheckboxDate[]
}

export interface ConfigUeCheckboxDateRangeList extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_DATE_RANGE_LIST
  list: ConfigUeCheckboxDateRange[]
  label?: string
  previousDateRangeText?: string
  hideWorkingHours: boolean
  min?: string
  max?: string
}

export interface ConfigUeDiagnosisTerminology {
  id: string
  label: string
}

export interface ConfigUeDiagnosisId {
  id: string
}

export interface ConfigUeDiagnoses extends CertificateDataConfig {
  type: ConfigTypes.UE_DIAGNOSES
  terminology: ConfigUeDiagnosisTerminology[]
  list: ConfigUeDiagnosisId[]
}

export interface ConfigUeDropdownItem {
  id: string
  label: string
}

export interface ConfigUeDropdown extends CertificateDataConfig {
  type: ConfigTypes.UE_DROPDOWN
  list: ConfigUeDropdownItem[]
  label?: string
}

export interface ConfigUeDate extends CertificateDataConfig {
  type: ConfigTypes.UE_DATE
  id: string
  maxDate?: string
  minDate?: string
}

export interface ConfigUeDateRange extends CertificateDataConfig {
  id: string
  type: ConfigTypes.UE_DATE_RANGE
  fromLabel: string
  toLabel: string
}

export interface ConfigUeIcf extends CertificateDataConfig {
  type: ConfigTypes.UE_ICF
  id: string
  label: string
  modalLabel: string
  collectionsLabel: string
  placeholder: string
}

export interface ConfigUeHeader extends CertificateDataConfig {
  type: ConfigTypes.UE_HEADER
  id: string
  label: string
}

export interface ConfigUeUncertainDate extends CertificateDataConfig {
  type: ConfigTypes.UE_UNCERTAIN_DATE
  id: string
  label: string
  allowedYears: string[]
  unknownYear: boolean
  unknownMonth: boolean
}

export interface ConfigUeCodeItem {
  id: string
  label: string
  code: string | null
}

export interface ConfigUeMedicalInvestigation {
  investigationTypeId: string
  informationSourceId: string
  dateId: string
  typeOptions: ConfigUeCodeItem[]
  maxDate?: string
  minDate?: string
}

export interface ConfigUeMedicalInvestigationList extends CertificateDataConfig {
  type: ConfigTypes.UE_MEDICAL_INVESTIGATION
  typeText: string
  dateText: string
  informationSourceText: string
  informationSourceDescription: string
  list: ConfigUeMedicalInvestigation[]
}

export interface ConfigUeCauseOfDeathControl {
  id: string
  descriptionId: string
  debutId: string
  specifications: ConfigUeCodeItem[]
  maxDate?: string
  minDate?: string
}

export interface ConfigUeCauseOfDeath extends CertificateDataConfig {
  title: string
  type: ConfigTypes.UE_CAUSE_OF_DEATH
  label?: string
  causeOfDeath: ConfigUeCauseOfDeathControl
}

export interface ConfigUeCauseOfDeathList extends CertificateDataConfig {
  type: ConfigTypes.UE_CAUSE_OF_DEATH_LIST
  itemCount?: number
  list: ConfigUeCauseOfDeathControl[]
}

export interface ConfigEyeAcuity {
  label: string
  withoutCorrectionId: string
  withCorrectionId: string
  contactLensesId?: string
}

export interface ConfigUeVisualAcuity extends CertificateDataConfig {
  type: ConfigTypes.UE_VISUAL_ACUITY
  withoutCorrectionLabel: string
  withCorrectionLabel: string
  contactLensesLabel: string
  rightEye: ConfigEyeAcuity
  leftEye: ConfigEyeAcuity
  binocular: ConfigEyeAcuity
}

export interface ConfigUeViewText extends CertificateDataConfig {
  type: ConfigTypes.UE_VIEW_TEXT
  label?: string
}

export interface ConfigUeViewList extends CertificateDataConfig {
  type: ConfigTypes.UE_VIEW_LIST
  label?: string
}

export interface ConfigViewColumn {
  id: string
  text: string
}

export interface ConfigUeViewTable extends CertificateDataConfig {
  type: ConfigTypes.UE_VIEW_TABLE
  columns: ConfigViewColumn[]
}

export interface ConfigUeYear extends CertificateDataConfig {
  id: string
  type: ConfigTypes.UE_YEAR
  minYear?: number
  maxYear?: number
}

export interface ConfigUeInteger extends CertificateDataConfig {
  type: ConfigTypes.UE_INTEGER
  id: string
  unitOfMeasurement?: string
  min?: number
  max?: number
}
