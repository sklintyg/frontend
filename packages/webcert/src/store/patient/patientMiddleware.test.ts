import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { patientMiddleware } from './patientMiddleware'
import { getPatient, GetPatientResponse } from './patientActions'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { PatientStatus } from '@frontend/common/src/types/patient'
import apiMiddleware from '../api/apiMiddleware'
import { createPatient } from '../../components/patient/patientTestUtils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const mockHistory = {
  push: jest.fn(),
}

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
      // @ts-expect-error mocking history
      testStore.dispatch(getPatient({ patientId: 'patientId', history: mockHistory }))

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
      expect(fakeAxios.history.get[0].url).toEqual('/api/patient/patientId')
    })

    it('shall save patient if response includes status FOUND', async () => {
      const expectedPatient = createPatient('patientId')
      const getPatientSuccess = { patient: expectedPatient, status: PatientStatus.FOUND } as GetPatientResponse
      fakeAxios.onGet('/api/patient/patientId').reply(200, getPatientSuccess)

      // @ts-expect-error mocking history
      testStore.dispatch(getPatient({ patientId: 'patientId', history: mockHistory }))

      await flushPromises()
      expect(testStore.getState().ui.uiPatient.patient).toEqual(expectedPatient)
    })
  })
})
