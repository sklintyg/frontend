import { LoginMethod, SigningMethod, User } from '../../types'
import { fakeUnit } from './fakeUnit'

export const fakeUser = (value?: Partial<User>): User => ({
  hsaId: 'hsaId',
  name: 'name',
  role: 'role',
  loggedInUnit: fakeUnit(),
  loggedInCareUnit: fakeUnit(),
  loggedInCareProvider: fakeUnit(),
  preferences: null,
  signingMethod: SigningMethod.FAKE,
  loginMethod: LoginMethod.FAKE,
  protectedPerson: false,
  careProviders: [],
  ...value,
})
