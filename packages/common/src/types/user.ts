export interface User {
  name: string
  title: string
}

export const mockUser: User = {
  name: 'Arne Johansson',
  title: 'Läkare',
}

export const mockGetUserSelector = (): User => {
  return mockUser
}
