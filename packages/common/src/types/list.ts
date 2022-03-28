import { TableHeading } from '../components/Table/Table'

export interface CertificateListItem {
  [key: string]: string | PatientListInfo | boolean
}

export interface PatientListInfo {
  id: string
  protectedPerson: boolean
  deceased: boolean
  testIndicated: boolean
}

export enum DraftStatus {
  COMPLETE = 'COMPLETE',
  INCOMPLETE = 'INCOMPLETE',
  LOCKED = 'LOCKED',
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
}

export interface ListFilterConfig {
  type: ListFilterType
  id: string
  title: string
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

export interface ListFilterBooleanConfig extends ListFilterConfig {
  defaultValue: boolean
}

export interface ListFilterPersonIdConfig extends ListFilterConfig {
  placeholder: string
}

export interface ListFilterSelectConfig extends ListFilterConfig {
  values: ListFilterConfigValue[]
}

export interface ListFilterDateRangeConfig extends ListFilterConfig {
  to: ListFilterConfig
  from: ListFilterConfig
}

export interface ListConfig {
  filters: ListFilterConfig[]
  title: string
  pageSizes: number[]
  openCertificateTooltip: string
  searchCertificateTooltip: string
  tableHeadings: TableHeading[]
  defaultOrderBy: string
}

export interface ListFilterValue {
  type: ListFilterType
  [propName: string]: unknown
}

export interface ListFilterValueText extends ListFilterValue {
  value: string
}

export interface ListFilterValueBoolean extends ListFilterValue {
  value: boolean
}

export interface ListFilterValuePersonId extends ListFilterValue {
  value: string
}

export interface ListFilterValueDateRange extends ListFilterValue {
  to: Date
  from: Date
}

export interface ListFilterValueSelect extends ListFilterValue {
  value: string
}

export enum ListType {
  DRAFTS = 'DRAFTS',
  QUESTIONS = 'QUESTIONS',
  CERTIFICATES = 'CERTIFICATES',
  UNKOWN = 'UNKOWN',
}

export interface ListFilter {
  values?: ListFilterValues
}

export interface ListFilterValues {
  [propName: string]: ListFilterValue
}
