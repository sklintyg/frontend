import faker from 'faker'
import { Unit } from '../types/certificate'

export const fakeUnit = (data?: Partial<Unit>): Unit => {
  return {
    unitId: faker.random.alpha({ count: 5 }),
    unitName: faker.lorem.words(),
    address: faker.address.streetAddress(),
    zipCode: faker.random.alphaNumeric(5),
    city: faker.address.city(),
    phoneNumber: faker.random.alphaNumeric(10),
    email: faker.internet.email(),
    isInactive: false,
    ...data,
  }
}
