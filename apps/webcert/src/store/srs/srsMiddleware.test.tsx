import MockAdapter from 'axios-mock-adapter'
import { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { configureApplicationStore } from '../configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { utilsMiddleware } from '../utils/utilsMiddleware'
import { apiMiddleware } from '../api/apiMiddleware'
import { srsMiddleware } from './srsMiddleware'
import {
  getPredictions,
  getRecommendations,
  getSRSCodes,
  logSrsInteraction,
  PredictionsRequest,
  RiskOpinionRequest,
  setRiskOpinion,
  updateCertificateId,
  updateHasLoadedSRSContent,
  updateLoggedCertificateId,
  updateSrsPredictions,
} from './srsActions'
import {
  CertificateStatus,
  fakeCertificate,
  fakeCertificateMetaData,
  fakeDiagnosesElement,
  fakeRadioMultipleCodeElement,
  fakeSrsAnswer,
  fakeSrsInfo,
  fakeSrsPrediction,
  fakeUser,
  SrsEvent,
  SrsUserClientContext,
  User,
} from '@frontend/common'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import { getUserSuccess } from '../user/userActions'

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

    it('should reset predictions if certificate data element updates with diagnosis list', async () => {
      const element = fakeDiagnosesElement({ id: 'QUESTION_ID' })
      const prediction = fakeSrsPrediction()
      testStore.dispatch(updateSrsPredictions([prediction]))
      testStore.dispatch(updateCertificateDataElement(element['QUESTION_ID']))
      await flushPromises()

      expect(testStore.getState().ui.uiSRS.srsPredictions).toHaveLength(0)
    })

    it('should not reset predictions if certificate data element updates with other element than diagnosis list', async () => {
      const element = fakeRadioMultipleCodeElement({ id: 'QUESTION_ID' })
      const prediction = fakeSrsPrediction()
      testStore.dispatch(updateSrsPredictions([prediction]))
      testStore.dispatch(updateCertificateDataElement(element['QUESTION_ID']))
      await flushPromises()

      expect(testStore.getState().ui.uiSRS.srsPredictions).toHaveLength(1)
    })
  })

  describe('Handle get srs recommendations', () => {
    const request = {
      certificateId: 'id',
      patientId: 'pid',
      code: 'j20',
      daysIntoSickLeave: undefined,
    }

    it('should set error if api error', async () => {
      fakeAxios.onPost(`/api/srs/id/pid/j20?prediktion=false&atgard=true&statistik=true`).reply(500, {})
      testStore.dispatch(getRecommendations(request))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.error).toBeTruthy()
    })

    it('should remove error if api success', async () => {
      fakeAxios.onPost(`/api/srs/id/pid/j20?prediktion=false&atgard=true&statistik=true`).reply(200, fakeSrsInfo())
      testStore.dispatch(getRecommendations(request))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.error).toBeFalsy()
    })

    it('should set srs info if api success', async () => {
      const expectedResponse = fakeSrsInfo()
      fakeAxios.onPost(`/api/srs/id/pid/j20?prediktion=false&atgard=true&statistik=true`).reply(200, expectedResponse)
      testStore.dispatch(getRecommendations(request))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.srsInfo).toEqual(expectedResponse)
    })
  })

  describe('Handle get srs prediction', () => {
    const request: PredictionsRequest = {
      patientId: 'patientId',
      code: 'code',
      certificateId: 'certificateId',
      answers: [fakeSrsAnswer()],
      daysIntoSickLeave: undefined,
    }

    it('should set error if api error', async () => {
      fakeAxios.onPost(`/api/srs/certificateId/patientId/code?prediktion=true&atgard=false&statistik=false`).reply(500, {})
      testStore.dispatch(getPredictions(request))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.error).toBeTruthy()
    })

    it('should remove error if api success', async () => {
      const expectedResponse = { predictions: fakeSrsPrediction(), extensionChain: [] }
      fakeAxios.onPost(`/api/srs/certificateId/patientId/code?prediktion=true&atgard=false&statistik=false`).reply(200, expectedResponse)
      testStore.dispatch(getPredictions(request))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.error).toBeFalsy()
    })

    it('should set predictions api success', async () => {
      const expectedResponse = { predictions: fakeSrsPrediction(), extensionChain: [] }
      fakeAxios.onPost(`/api/srs/certificateId/patientId/code?prediktion=true&atgard=false&statistik=false`).reply(200, expectedResponse)
      testStore.dispatch(getPredictions(request))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.srsPredictions).toEqual(expectedResponse.predictions)
    })

    it('should perform api call to correct endpoint if daysIntoSickLeave is missing', async () => {
      testStore.dispatch(getPredictions(request))
      await flushPromises()
      expect(fakeAxios.history.post[0].url).toEqual('/api/srs/certificateId/patientId/code?prediktion=true&atgard=false&statistik=false')
    })

    it('should perform api call to correct endpoint if daysIntoSickLeave is set', async () => {
      request.daysIntoSickLeave = 45
      testStore.dispatch(getPredictions(request))
      await flushPromises()
      expect(fakeAxios.history.post[0].url).toEqual(
        '/api/srs/certificateId/patientId/code?prediktion=true&atgard=false&statistik=false&daysIntoSickLeave=45'
      )
    })
  })

  describe('Handle set risk opinion', () => {
    const request: RiskOpinionRequest = {
      patientId: 'patientId',
      code: 'code',
      certificateId: 'certificateId',
      unitId: 'unitId',
      careGiverId: 'careGiverId',
      riskOpinion: 'HOGRE',
    }

    it('should perform api call when dispatched is made', async () => {
      testStore.dispatch(setRiskOpinion(request))
      await flushPromises()
      expect(fakeAxios.history.put.length).toEqual(1)
    })

    it('should perform api call to correct endpoint', async () => {
      testStore.dispatch(setRiskOpinion(request))
      await flushPromises()
      expect(fakeAxios.history.put[0].url).toEqual('/api/srs/opinion/patientId/careGiverId/unitId/certificateId/code')
    })
  })

  describe('Handle getUserSuccess', () => {
    it('should save user launch from origin', () => {
      const user: User = fakeUser({
        launchFromOrigin: 'rs',
      })

      testStore.dispatch(getUserSuccess({ user, links: [] }))
      expect(testStore.getState().ui.uiSRS.userLaunchFromOrigin).toEqual('rs')
      expect(testStore.getState().ui.uiSRS.userClientContext).toEqual(SrsUserClientContext.SRS_REH)
    })
  })

  describe('Handle update certificate', () => {
    const element = fakeDiagnosesElement({ id: 'QUESTION_ID' })
    const certificate = fakeCertificate({ data: element, metadata: fakeCertificateMetaData({ status: CertificateStatus.SIGNED }) })

    it('should update diagnosis list if certificate updates', async () => {
      testStore.dispatch(updateCertificate(certificate))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.diagnosisListValue).toEqual(element['QUESTION_ID'].value)
    })

    it('should update patient id if certificate updates', async () => {
      testStore.dispatch(updateCertificate(certificate))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.patientId).toEqual(certificate.metadata.patient.personId.id)
    })

    it('should update user client context certificate updates', async () => {
      testStore.dispatch(updateCertificate(certificate))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.userClientContext).toEqual(SrsUserClientContext.SRS_SIGNED)
    })

    it('should update certificate id if certificate updates', async () => {
      testStore.dispatch(updateCertificate(certificate))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.certificateId).toEqual(certificate.metadata.id)
    })

    it('should update unit id if certificate updates', async () => {
      testStore.dispatch(updateCertificate(certificate))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.unitId).toEqual(certificate.metadata.careUnit.unitId)
    })

    it('should update care provider id if certificate updates', async () => {
      testStore.dispatch(updateCertificate(certificate))
      await flushPromises()
      expect(testStore.getState().ui.uiSRS.careProviderId).toEqual(certificate.metadata.careProvider.unitId)
    })
  })

  describe('Log SRS interaction', () => {
    describe('logging has been performed', () => {
      beforeEach(() => {
        testStore.dispatch(updateCertificateId('ID'))
        testStore.dispatch(updateLoggedCertificateId('ID'))
        testStore.dispatch(updateHasLoadedSRSContent(true))
      })

      it('should perform api call that is not SRS_PANEL_ACTIVATED', async () => {
        testStore.dispatch(logSrsInteraction(SrsEvent.SRS_STATISTICS_ACTIVATED))
        await flushPromises()

        expect(fakeAxios.history.post).toHaveLength(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/jslog/srs')
      })

      it('should perform api call for SRS_PANEL_ACTIVATED', async () => {
        testStore.dispatch(logSrsInteraction(SrsEvent.SRS_PANEL_ACTIVATED))
        await flushPromises()
        expect(fakeAxios.history.post).toHaveLength(0)
      })
    })

    describe('logging has not been performed', () => {
      beforeEach(() => {
        testStore.dispatch(updateCertificateId('ID'))
        testStore.dispatch(updateLoggedCertificateId('not ID'))
      })

      it('should perform api call that is not SRS_PANEL_ACTIVATED if SRS has loaded', async () => {
        testStore.dispatch(logSrsInteraction(SrsEvent.SRS_STATISTICS_ACTIVATED))
        testStore.dispatch(updateHasLoadedSRSContent(true))
        await flushPromises()

        expect(fakeAxios.history.post).toHaveLength(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/jslog/srs')
      })

      it('should perform api call that is not SRS_PANEL_ACTIVATED', async () => {
        testStore.dispatch(logSrsInteraction(SrsEvent.SRS_STATISTICS_ACTIVATED))
        await flushPromises()

        expect(fakeAxios.history.post).toHaveLength(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/jslog/srs')
      })

      it('should not perform api call for SRS_PANEL_ACTIVATED if SRS has not loaded', async () => {
        testStore.dispatch(updateHasLoadedSRSContent(false))
        testStore.dispatch(logSrsInteraction(SrsEvent.SRS_PANEL_ACTIVATED))
        await flushPromises()
        expect(fakeAxios.history.post).toHaveLength(0)
      })
    })
  })
})
