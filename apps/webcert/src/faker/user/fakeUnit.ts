import faker from 'faker'
import type { CareUnit } from '../../types'
import type { Unit } from '../../types/certificate'
import { fakeId } from '../fakeId'

export function fakeUnitName() {
  return `${faker.address.county()} ${faker.address.direction()} ${faker.address.city()}`
}

export const fakeUnit = (data?: Partial<Unit>): Unit => {
  return {
    unitId: fakeId(),
    unitName: fakeUnitName(),
    address: faker.address.streetAddress(),
    zipCode: faker.random.alphaNumeric(5),
    city: faker.address.city(),
    phoneNumber: faker.random.alphaNumeric(10),
    email: faker.internet.email(),
    isInactive: false,
    ...data,
  }
}

export function fakeCareUnit(data?: Partial<CareUnit>): CareUnit {
  return {
    units: [],
    ...fakeUnit(data),
  }
}
