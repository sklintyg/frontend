import faker from 'faker'
import type { CareProvider } from '../../types'
import { fakeId } from '../fakeId'

export const fakeCareProvider = (data?: Partial<CareProvider>): CareProvider => {
  return {
    id: fakeId(),
    name: `Vårdenhet ${faker.company.companyName()}`,
    missingSubscription: false,
    careUnits: [],
    ...data,
  }
}
