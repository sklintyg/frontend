import { ResourceLink } from './resourceLink'

export interface CertificateListItem {
  values: { [key: string]: string | PatientListInfo | ForwardedListInfo | ResourceLink[] | boolean }
}

export interface ListButtonTooltips {
  [key: string]: string
}

export interface PatientListInfo {
  id: string
  protectedPerson: boolean
  deceased: boolean
  testIndicated: boolean
}

export enum CertificateListItemValueType {
  TEXT = 'TEXT',
  DATE = 'DATE',
  PATIENT_INFO = 'PATIENT_INFO',
  FORWARD = 'FORWARD',
  HIDDEN = 'HIDDEN',
  OPEN_BUTTON = 'OPEN_BUTTON',
  RENEW_BUTTON = 'RENEW_BUTTON',
  SEARCH_BUTTON = 'SEARCH_BUTTON',
  RESET_BUTTON = 'RESET_BUTTON',
  FORWARD_BUTTON = 'FORWARD_BUTTON',
}

export enum ListFilterType {
  TEXT = 'TEXT',
  SELECT = 'SELECT',
  DATE_RANGE = 'DATE_RANGE',
  PERSON_ID = 'PERSON_ID',
  UNKOWN = 'UNKOWN',
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
  ORDER = 'ORDER',
  PAGESIZE = 'PAGESIZE',
  STARTFROM = 'STARTFROM',
  DATE = 'DATE',
  RADIO = 'RADIO',
}

export interface ListFilterConfigBase {
  id: string
  title: string
  alwaysHighlighted: boolean
  description?: string
}

export interface ListFilterConfigValue {
  id: string
  name: string
  defaultValue: boolean
}

export interface ListFilterTextConfig extends ListFilterConfigBase {
  type: ListFilterType.TEXT
  placeholder: string
}

export interface ListFilterOrderConfig extends ListFilterConfigBase {
  type: ListFilterType.ORDER
  defaultValue: string
}

export interface ListFilterPageSizeConfig extends ListFilterConfigBase {
  type: ListFilterType.PAGESIZE
  pageSizes: number[]
}

export interface ListFilterBooleanConfig extends ListFilterConfigBase {
  type: ListFilterType.BOOLEAN
  defaultValue: boolean
}

export interface ListFilterPersonIdConfig extends ListFilterConfigBase {
  type: ListFilterType.PERSON_ID
  placeholder: string
}

export interface ListFilterSelectConfig extends ListFilterConfigBase {
  type: ListFilterType.SELECT
  values: ListFilterConfigValue[]
}

export interface ListFilterRadioConfig extends ListFilterConfigBase {
  type: ListFilterType.RADIO
  values: ListFilterConfigValue[]
}

export interface ListFilterDateConfig extends ListFilterConfigBase {
  type: ListFilterType.DATE
  max?: string
  min?: string
  defaultValue?: string
}

export interface ListFilterDateRangeConfig extends ListFilterConfigBase {
  type: ListFilterType.DATE_RANGE
  to: ListFilterDateConfig
  from: ListFilterDateConfig
  forbidFutureDates: boolean
}

export type ListFilterConfig =
  | ListFilterTextConfig
  | ListFilterOrderConfig
  | ListFilterPageSizeConfig
  | ListFilterBooleanConfig
  | ListFilterPersonIdConfig
  | ListFilterSelectConfig
  | ListFilterRadioConfig
  | ListFilterDateConfig
  | ListFilterDateRangeConfig

export interface TableHeading {
  id: string
  title: string
  type: CertificateListItemValueType
  description: string
  defaultAscending: boolean
}

export interface ListConfig {
  filters: ListFilterConfig[]
  title: string
  secondaryTitle: string
  description: string
  emptyListText: string
  tableHeadings: TableHeading[]
  defaultOrderBy: string
  excludeFilterButtons: boolean
  buttonTooltips: ListButtonTooltips
  shouldUpdateConfigAfterListSearch: boolean
}

export interface ListFilterValueText {
  type: ListFilterType.TEXT
  value: string
}

export interface ListFilterValueBoolean {
  type: ListFilterType.BOOLEAN
  value: boolean
}

export interface ListFilterValueNumber {
  type: ListFilterType.NUMBER
  value: number
}

export interface ListFilterValuePersonId {
  type: ListFilterType.PERSON_ID
  value: string
}

export interface ListFilterValueDateRange {
  type: ListFilterType.DATE_RANGE
  to: string
  from: string
}

export interface ListFilterValueSelect {
  type: ListFilterType.SELECT
  value: string
}

export interface ListFilterValueRadio {
  type: ListFilterType.RADIO
  value: string
}

export interface ListFilterValueOrder {
  type: ListFilterType.ORDER
  value: string
}

export interface ListFilterValueUnknown {
  type: ListFilterType.UNKOWN
}

export type ListFilterValue =
  | ListFilterValueText
  | ListFilterValueBoolean
  | ListFilterValueNumber
  | ListFilterValuePersonId
  | ListFilterValueDateRange
  | ListFilterValueSelect
  | ListFilterValueRadio
  | ListFilterValueOrder
  | ListFilterValueUnknown

export enum ListType {
  DRAFTS = 'DRAFTS',
  UNHANDLED_CERTIFICATES = 'UNHANDLED_CERTIFICATES',
  CERTIFICATES = 'CERTIFICATES',
  PREVIOUS_CERTIFICATES = 'PREVIOUS_CERTIFICATES',
  UNKOWN = 'UNKOWN',
}

export interface ListFilter {
  values?: Record<string, ListFilterValue>
  type: ListType
}

export interface ForwardedListInfo {
  forwarded: boolean
  unitName: string
  careProviderName: string
  certificateType: string
}
