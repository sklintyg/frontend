import faker from 'faker'
import { PartialDeep } from 'type-fest'
import { Patient } from '../types/patient'

export const fakePatient = (data?: PartialDeep<Patient>): Patient => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const street = faker.address.streetAddress()
  const zipCode = faker.address.zipCode()
  const city = faker.address.city()
  return {
    firstName,
    lastName,
    fullName: data?.fullName ?? `${firstName} ${lastName}`,
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
    ...data,
    personId: { type: faker.random.alpha(), id: faker.random.alpha(), ...data?.personId },
    previousPersonId: { type: faker.random.alpha(), id: faker.random.alpha(), ...data?.previousPersonId },
  }
}
