export interface User {
  name: string
  title: string
  unit: Unit
}

export interface Unit {
  unit: string
  center: string
}

export const mockUser: User = {
  name: 'Arne Johansson',
  title: 'Läkare',
  unit: { center: 'Frösö hälsocentral', unit: 'nmt_vg1_ve1' },
}

export const mockGetUserSelector = (): User => {
  return mockUser
}
