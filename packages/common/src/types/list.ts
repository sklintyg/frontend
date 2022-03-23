import { PersonId } from './patient'

export interface PatientStatuses {
  protectedPerson: boolean
  deceased: boolean
  testIndicated: boolean
}

export interface CertificateListItem {
  certificateId: string
  patientId: PersonId
  certificateType: string
  //status: CertificateStatus
  savedBy: string
  saved: Date
  forwarded: boolean
  patientStatuses: PatientStatuses
  certificateTypeName: string
}

export enum DraftStatus {
  COMPLETE = 'COMPLETE',
  INCOMPLETE = 'INCOMPLETE',
  LOCKED = 'LOCKED',
}

export interface ListDraftFilter {
  forwarded: boolean
  status: DraftStatus
  savedFrom: Date
  savedTo: Date
  savedByHsaID: string
  patientId: string
  pageSize: number
  startFrom: number
  orderBy: string
  ascending: boolean
}

export enum ListFilterType {
  TEXT = 'TEXT',
  SELECT = 'SELECT',
  DATE_RANGE = 'DATE_RANGE',
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
}

export interface ListFilterValue {
  id: string
}

export interface ListFilterValueText extends ListFilterValue {
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
  type: ListType
  values: ListFilterValue[]
}
