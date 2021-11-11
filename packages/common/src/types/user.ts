import { Unit } from './certificate'

export interface User {
  hsaId: string
  name: string
  role: string
  loggedInUnit: Unit
  loggedInCareProvider: Unit
  //TODO: This is filled at login in backend. It looks like below in the user-object. It makes it easier to fetch data if preference is a map.
  //"anvandarPreference": {
  //  "wc.dontShowFornyaDialog":"false",
  //  "wc.sidebarMinimized":"false"
  //  }
  preferences: { [key: string]: string } | null
  signingMethod: SigningMethod
  protectedPerson: boolean
}

export enum SigningMethod {
  DSS = 'DSS',
  FAKE = 'FAKE',
}

export interface UserProperty {
  key: string
  value: string
}

export interface FakeLogin {
  hsaId: string
}
