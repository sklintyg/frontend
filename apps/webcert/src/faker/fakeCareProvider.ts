import faker from 'faker'
import { CareProvider } from '../types'

export const fakeCareProvider = (data?: Partial<CareProvider>): CareProvider => {
  return {
    id: faker.random.alpha({ count: 5 }),
    name: `Vårdenhet ${faker.company.companyName()}`,
    missingSubscription: false,
    careUnits: [],
    ...data,
  }
}
