import faker from 'faker'
import type { PartialDeep } from 'type-fest'
import type { Patient, PersonId } from '../types/patient'

export function fakePatientId() {
  return `${faker.date.past().toISOString().split('T')[0].replace(/-/g, '')}${faker.random.alphaNumeric(4)}`
}

export function fakePersonId(data?: Partial<PersonId>): PersonId {
  return { type: faker.random.alpha(), id: fakePatientId(), ...data }
}

export function fakePatient(data?: PartialDeep<Patient>): Patient {
  const firstName = faker.name.firstName()
  const middleName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const street = faker.address.streetAddress()
  const zipCode = faker.address.zipCode()
  const city = faker.address.city()
  return {
    firstName,
    lastName,
    middleName,
    fullName: data?.fullName ?? `${firstName} ${middleName} ${lastName}`,
    street,
    zipCode,
    city,
    coordinationNumber: false,
    testIndicated: false,
    protectedPerson: false,
    deceased: false,
    differentNameFromEHR: false,
    personIdChanged: false,
    reserveId: false,
    addressFromPU: false,
    ...data,
    personId: fakePersonId(data?.personId),
    previousPersonId: fakePersonId(data?.previousPersonId),
  }
}
