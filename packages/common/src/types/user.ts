export interface User {
  hsaId: string
  name: string
  role: string
  loggedInUnit: string
  loggedInCareProvider: string
  //TODO: This is filled at login in backend. Is this the right location? Must the name be changed to match backend?
  preferences: { [key: string]: string } | null
}

export interface KeyValuePair {
  key: string
  value: string
}

export interface FakeLogin {
  hsaId: string
}
