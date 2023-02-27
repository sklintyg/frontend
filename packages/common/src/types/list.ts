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

export interface ListFilterConfig {
  type: ListFilterType
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

export interface ListFilterTextConfig extends ListFilterConfig {
  placeholder: string
}

export interface ListFilterOrderConfig extends ListFilterConfig {
  defaultValue: string
}

export interface ListFilterPageSizeConfig extends ListFilterConfig {
  pageSizes: number[]
}

export interface ListFilterBooleanConfig extends ListFilterConfig {
  defaultValue: boolean
}

export interface ListFilterPersonIdConfig extends ListFilterConfig {
  placeholder: string
}

export interface ListFilterSelectConfig extends ListFilterConfig {
  values: ListFilterConfigValue[]
}

export interface ListFilterRadioConfig extends ListFilterConfig {
  values: ListFilterConfigValue[]
}

export interface ListFilterDateConfig extends ListFilterConfig {
  max?: string
  min?: string
  defaultValue?: string
}

export interface ListFilterDateRangeConfig extends ListFilterConfig {
  to: ListFilterDateConfig
  from: ListFilterDateConfig
  forbidFutureDates: boolean
}

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

export interface ListFilterValue {
  type?: ListFilterType
  [propName: string]: unknown
}

export interface ListFilterValueText extends ListFilterValue {
  value: string
}

export interface ListFilterValueBoolean extends ListFilterValue {
  value: boolean
}

export interface ListFilterValueNumber extends ListFilterValue {
  value: number
}

export interface ListFilterValuePersonId extends ListFilterValue {
  value: string
}

export interface ListFilterValueDateRange extends ListFilterValue {
  to: string
  from: string
}

export interface ListFilterValueSelect extends ListFilterValue {
  value: string
}

export interface ListFilterValueRadio extends ListFilterValue {
  value: string
}

export enum ListType {
  DRAFTS = 'DRAFTS',
  UNHANDLED_CERTIFICATES = 'UNHANDLED_CERTIFICATES',
  CERTIFICATES = 'CERTIFICATES',
  PREVIOUS_CERTIFICATES = 'PREVIOUS_CERTIFICATES',
  UNKOWN = 'UNKOWN',
}

export interface ListFilter {
  values?: ListFilterValues
  type: ListType
}

export interface ListFilterValues {
  [propName: string]: ListFilterValue
}

export interface ForwardedListInfo {
  forwarded: boolean
  unitName: string
  careProviderName: string
  certificateType: string
}
