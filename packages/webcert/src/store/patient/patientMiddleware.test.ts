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
import { ErrorCode } from '../error/errorReducer'

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
    fakeAxios.reset()
    clearDispatchedActions()
  })

  it('shall call api to get patient', async () => {
    testStore.dispatch(getPatient('patientId'))

    await flushPromises()
    expect(fakeAxios.history.get.length).toBe(1)
    expect(fakeAxios.history.get[0].url).toEqual('/api/patient/patientId')
  })

  it('shall save patient if response includes status FOUND', async () => {
    const expectedPatient = createPatient('patientId')
    const getPatientSuccess = { patient: expectedPatient, status: PatientStatus.FOUND } as GetPatientResponse
    fakeAxios.onGet('/api/patient/patientId').reply(200, getPatientSuccess)

    testStore.dispatch(getPatient('patientId'))

    await flushPromises()
    expect(testStore.getState().ui.uiPatient.patient).toEqual(expectedPatient)
  })

  it('shall save error if get patient response is NOT_FOUND', async () => {
    const getPatientSuccess = { patient: null, status: PatientStatus.NOT_FOUND } as GetPatientResponse
    fakeAxios.onGet('/api/patient/patientId').reply(200, getPatientSuccess)

    testStore.dispatch(getPatient('patientId'))

    await flushPromises()
    expect(testStore.getState().ui.uiPatient.error.errorCode).toEqual(ErrorCode.PATIENT_NOT_FOUND)
  })

  it('shall save error if get patient response is ERROR', async () => {
    const getPatientSuccess = { patient: null, status: PatientStatus.ERROR } as GetPatientResponse
    fakeAxios.onGet('/api/patient/patientId').reply(200, getPatientSuccess)

    testStore.dispatch(getPatient('patientId'))

    await flushPromises()
    expect(testStore.getState().ui.uiPatient.error.errorCode).toEqual(ErrorCode.PU_PROBLEM)
  })

  it('shall save error if get patient response is bad request', async () => {
    fakeAxios.onGet('/api/patient/patientId').reply(500)

    testStore.dispatch(getPatient('patientId'))

    await flushPromises()
    expect(testStore.getState().ui.uiPatient.error.errorCode).toEqual(ErrorCode.GETTING_PATIENT_ERROR)
  })
})
