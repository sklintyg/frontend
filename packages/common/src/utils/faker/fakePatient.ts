import { Patient } from '@frontend/common'
import faker from 'faker'

export const fakePatient = (): Patient => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    personId: { type: faker.random.alpha(), id: faker.random.alpha() },
    previousPersonId: { type: faker.random.alpha(), id: faker.random.alpha() },
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    coordinationNumber: false,
    testIndicated: false,
    protectedPerson: false,
    deceased: false,
    differentNameFromEHR: false,
    personIdChanged: false,
    reserveId: false,
  }
}
