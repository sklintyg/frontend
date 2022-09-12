import { faker } from '@faker-js/faker'
import { Staff } from '@frontend/common'

export const fakeStaff = (): Staff => {
  return {
    personId: faker.random.alpha(10),
    fullName: faker.name.fullName(),
    prescriptionCode: faker.random.alpha(),
  }
}
