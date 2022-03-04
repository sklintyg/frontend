export interface DynamicLinkData {
  key: string
  url: string
  text: string
  target: string
  tooltip: string
}

export interface Diagnosis {
  kod: string
  beskrivning: string
}

export interface DiagnosisTypeahead {
  resultat: string
  diagnoser: Diagnosis[]
  moreResults: boolean
}

export interface Banner {
  message: string
  priority: string
}
