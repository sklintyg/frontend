export interface User {
  name: string
  title: string
  loggedInUnit: string
  loggedInCareProvider: string
}

export const mockUser: User = {
  name: 'Arne Johansson',
  title: 'Läkare',
  loggedInUnit: 'NMT vg3 ve1',
  loggedInCareProvider: 'NMT vg3',
}

export const mockGetUserSelector = (): User => {
  return mockUser
}
