export interface IcfCode {
  title: string
  description: string
  includes?: string
  code: string
}

export interface Icd10Code {
  code: string
  title: string
}

export interface IcfCodeCollection {
  icfCodes: IcfCode[]
  icd10Codes: Icd10Code[]
}

export interface IcfCollection {
  commonCodes: IcfCodeCollection
  uniqueCodes: IcfCodeCollection[]
}
