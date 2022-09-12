import { faker } from '@faker-js/faker'
import { Unit } from '@frontend/common'

export const fakeUnit = (): Unit => {
  return {
    unitId: faker.random.alpha(5),
    unitName: faker.lorem.words(),
    address: faker.address.streetAddress(),
    zipCode: faker.random.numeric(5),
    city: faker.address.city(),
    phoneNumber: faker.random.numeric(10),
    email: faker.internet.email(),
    isInactive: false,
  }
}
