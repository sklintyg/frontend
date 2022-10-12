import { Patient } from '@frontend/common'
import faker from 'faker'
import { PartialDeep } from 'type-fest'

export const fakePatient = (data?: PartialDeep<Patient>): Patient => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    firstName,
    lastName,
    fullName: data?.fullName ?? `${firstName} ${lastName}`,
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
