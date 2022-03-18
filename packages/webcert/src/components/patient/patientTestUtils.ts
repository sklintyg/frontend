import { Patient } from '@frontend/common'

export const createPatient = (patientId: string): Patient => {
  return {
    firstName: 'firstName',
    lastName: 'lastName',
    fullName: 'firstName middleName lastName',
    deceased: false,
    protectedPerson: false,
    testIndicated: false,
    coordinationNumber: false,
    differentNameFromEHR: false,
    personIdUpdated: false,
    personId: {
      type: '',
      id: patientId,
    },
  }
}
