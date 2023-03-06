import MockAdapter from 'axios-mock-adapter'
import { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { configureApplicationStore } from '../configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { utilsMiddleware } from '../utils/utilsMiddleware'
import { apiMiddleware } from '../api/apiMiddleware'
import { srsMiddleware } from './srsMiddleware'
import { getSRSCodes } from './srsActions'
import { fakeCertificate, fakeDiagnosesElement } from '@frontend/common'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test certificate middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, srsMiddleware, utilsMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle get SRS codes', () => {
    it('should set error if api error', async () => {
      fakeAxios.onGet(`/api/srs/codes`).reply(500, {})
      testStore.dispatch(getSRSCodes())
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.error).toBeTruthy()
    })

    it('should set codes if api success', async () => {
      const expectedResponse = { 0: 'code' }
      fakeAxios.onGet(`/api/srs/codes`).reply(200, expectedResponse)
      testStore.dispatch(getSRSCodes())
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.diagnosisCodes[0]).toEqual('code')
    })

    it('should remove error if api success', async () => {
      const expectedResponse = { 0: 'code' }
      fakeAxios.onGet(`/api/srs/codes`).reply(200, expectedResponse)
      testStore.dispatch(getSRSCodes())
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.error).toBeFalsy()
    })
  })

  describe('Handle update diagnosis list value', () => {
    it('should update diagnosis list if certificate data element updates', async () => {
      const element = fakeDiagnosesElement({ id: 'QUESTION_ID' })
      testStore.dispatch(updateCertificateDataElement(element['QUESTION_ID']))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.diagnosisListValue).toEqual(element['QUESTION_ID'].value)
    })

    it('should update diagnosis list if certificate updates', async () => {
      const element = fakeDiagnosesElement({ id: 'QUESTION_ID' })
      testStore.dispatch(updateCertificate(fakeCertificate({ data: element })))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.diagnosisListValue).toEqual(element['QUESTION_ID'].value)
    })
  })
})
