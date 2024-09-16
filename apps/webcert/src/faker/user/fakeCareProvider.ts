import faker from 'faker'
import type { CareProvider } from '../../types'
import { fakeId } from '../fakeId'

export const fakeCareProvider = (data?: Partial<CareProvider>): CareProvider => {
  return {
    id: fakeId(),
    name: `Vårdgivare ${faker.address.county()} ${faker.address.direction()}`,
    missingSubscription: false,
    careUnits: [],
    ...data,
  }
}
