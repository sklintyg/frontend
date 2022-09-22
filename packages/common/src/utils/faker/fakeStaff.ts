import { Staff } from '@frontend/common'
import faker from 'faker'

export const fakeStaff = (data?: Partial<Staff>): Staff => {
  return {
    personId: faker.random.alpha({ count: 10 }),
    fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    prescriptionCode: faker.random.alpha(),
    ...data,
  }
}
