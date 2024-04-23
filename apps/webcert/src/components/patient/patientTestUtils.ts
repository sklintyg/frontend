import { fakePatient } from '../../faker'
import { Patient } from '../../types'

/** @deprecated use fakePatient() */
export const createPatient = (patientId: string): Patient => {
  return fakePatient({
    firstName: 'firstName',
    lastName: 'lastName',
    fullName: 'firstName middleName lastName',
    street: 'Street 1',
    zipCode: '12345',
    city: 'City',
    personId: {
      type: '',
      id: patientId,
    },
  })
}
