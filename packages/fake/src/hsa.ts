import { faker } from '@faker-js/faker'

export const fakeHSA = () =>
  `${faker.random.alpha({ count: 6, casing: 'upper' })}${faker.datatype.number({ min: 1e9 })}-${faker.datatype.number({ min: 1e3 })}`
