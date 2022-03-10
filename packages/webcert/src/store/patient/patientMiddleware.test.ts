import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { patientMiddleware } from './patientMiddleware'
import { getPatient, GetPatientSuccess } from './patientActions'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { PatientStatus } from '@frontend/common/src/types/patient'
import { Patient } from '@frontend/common'
import apiMiddleware from '../api/apiMiddleware'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test patient middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, patientMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle get patient', () => {
    it('shall call api to get patient', async () => {
      testStore.dispatch(getPatient('patientId'))

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
      expect(fakeAxios.history.get[0].url).toEqual('/api/patient/patientId')
    })

    it('shall save patient', async () => {
      const expectedPatient = createPatient('patientId')
      const getPatientSuccess = { patient: expectedPatient, status: PatientStatus.FOUND } as GetPatientSuccess
      fakeAxios.onGet('/api/certificate/patientId').reply(200, getPatientSuccess)

      testStore.dispatch(getPatient('patientId'))

      await flushPromises()
      expect(testStore.getState().ui.uiPatient.patient).toEqual(expectedPatient)
    })
  })
})

const createPatient = (patientId: string): Patient => {
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
