export interface User {
  hsaId: string
  name: string
  role: string
  loggedInUnit: string
  loggedInCareProvider: string
}

export interface FakeLogin {
  hsaId: string
}
