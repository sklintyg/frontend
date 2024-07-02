import type { User } from '../../types'
import { LoginMethod, SigningMethod } from '../../types'
import { fakeCareProvider } from './fakeCareProvider'
import { fakeUnit } from './fakeUnit'

const unit = fakeUnit()

export const fakeUser = (value?: Partial<User>): User => ({
  hsaId: 'hsaId',
  name: 'name',
  role: 'role',
  loggedInUnit: unit,
  loggedInCareUnit: unit,
  loggedInCareProvider: unit,
  preferences: null,
  signingMethod: SigningMethod.FAKE,
  loginMethod: LoginMethod.FAKE,
  protectedPerson: false,
  careProviders: [fakeCareProvider({ id: unit.unitId, name: unit.unitName })],
  ...value,
})
