import { CertificateType, PatientStatus } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { createPatient } from '../../components/patient/patientTestUtils'
import { apiMiddleware } from '../api/apiMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import { ErrorCode } from '../error/errorReducer'
import { getSessionStatusError } from '../session/sessionActions'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { getCertificateTypes, getPatient, GetPatientResponse, updateCertificateTypes } from './patientActions'
import { patientMiddleware } from './patientMiddleware'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const certificateTypes: CertificateType[] = [
  {
    description: 'description',
    detailedDescription: 'detailedDescription',
    id: 'id',
    issuerTypeId: 'issuerTypeId',
    label: 'label',
    links: [],
    message: 'message',
  },
]

describe('Test patient middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, patientMiddleware])
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

  it('Should reset certificateTypes information on session error', () => {
    testStore.dispatch(updateCertificateTypes(certificateTypes))

    expect(testStore.getState().ui.uiPatient.certificateTypes).toEqual(certificateTypes)

    testStore.dispatch(
      getSessionStatusError({
        error: {
          api: 'api',
          errorCode: 'errorCode',
          message: 'message',
        },
      })
    )

    expect(testStore.getState().ui.uiPatient.certificateTypes).toEqual([])
  })

  it('should set loadingCertificateTypes to true when the certificate types are fetched', () => {
    testStore.dispatch(updateCertificateTypes(certificateTypes))

    expect(testStore.getState().ui.uiPatient.loadingCertificateTypes).toEqual(false)

    testStore.dispatch(getCertificateTypes('patientId'))

    expect(testStore.getState().ui.uiPatient.loadingCertificateTypes).toEqual(true)
  })
})
