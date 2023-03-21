export interface User {
  hsaId: string
  namn: string
  titel: string
  authenticationScheme: string
  vardgivare: Vardgivare[]
  befattningar: string[]
  valdVardenhet: Vardenheter | null
  valdVardgivare: Vardgivare | null
  roles: Roles
  totaltAntalVardenheter: number
  urval: string
  pdlConsentGiven: boolean
  roleSwitchPossible: boolean
  features: Features
  preferences: Preferences
}

export interface Features {
  SRS: Srs
}

export interface Srs {
  name: string
  desc: string
  global: boolean
  intygstyper: unknown[]
}

export interface Preferences {
  lakarutlatandeUnitTableColumns: string
  pdlConsentGiven: string
  patientTableColumns: string
  sjukfallTableColumns: string
  lakarutlatandenTableColumns: string
  maxAntalDagarSedanSjukfallAvslut: string
  standardenhet: null
  maxAntalDagarMellanIntyg: string
}

export interface Roles {
  LAKARE: Lakare
}

export interface Lakare {
  name: string
  desc: string
  privileges: unknown[]
}

export interface Vardgivare {
  '@class': string
  id: string
  namn: string
  vardenheter: Vardenheter[]
}

export interface Vardenheter {
  '@class': Record<string, string>
  id: string
  namn: string
  epost: null | string
  postadress: null | string
  postnummer: null | string
  postort: null | string
  telefonnummer: string
  arbetsplatskod: string
  vardgivareOrgnr: Record<string, string> | null
  agandeForm: AgandeForm
  start: Date | null
  end: null
  vardgivareHsaId?: string
  mottagningar?: Vardenheter[]
  parentHsaId?: string
}

export enum AgandeForm {
  Privat = 'PRIVAT',
}
