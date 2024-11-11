import type { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {
  fakeCertificate,
  fakeCertificateMetaData,
  fakeCertificateRelation,
  fakeCertificateRelations,
  fakeCertificateValidationError,
  fakeCertificateValue,
  fakeDateElement,
  fakeHighlightValidation,
  fakeRadioBooleanElement,
  fakeUser,
} from '../../faker'
import type { Certificate, CertificateRelation, CertificateRelations } from '../../types'
import { CertificateDataElementStyleEnum, CertificateRelationType, CertificateStatus, SigningMethod } from '../../types'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import { throwError } from '../error/errorActions'
import { ErrorCode, ErrorType } from '../error/errorReducer'
import { push, replace } from '../navigateSlice'
import { getSessionStatusError } from '../session/sessionActions'
import type { RootState } from '../store'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import { updateUser } from '../user/userActions'
import { utilsMiddleware } from '../utils/utilsMiddleware'
import type {
  CertificateApiGenericError,
  ComplementCertificateSuccess,
  CreateCertificate,
  CreateCertificateFromCandidateSuccess,
  CreateCertificateResponse,
  SigningData,
} from './certificateActions'
import {
  answerComplementCertificate,
  autoSaveCertificateError,
  certificateApiGenericError,
  complementCertificateSuccess,
  createCertificateFromCandidate,
  createNewCertificate,
  deleteCertificate,
  getCertificate,
  getCertificateError,
  hideSpinner,
  readyForSign,
  readyForSignSuccess,
  showValidationErrors,
  signCertificateStatusError,
  startSignCertificate,
  updateCertificate,
  updateCertificateDataElement,
  validateCertificateSuccess,
} from './certificateActions'
import { certificateMiddleware } from './certificateMiddleware'
import {
  getCareUnitValidationErrors,
  getPatientValidationErrors,
  getQuestion,
  getShowValidationErrors,
  getVisibleValidationErrors,
} from './certificateSelectors'

const getExpectedError = (errorCode: string): CertificateApiGenericError => ({
  error: {
    api: 'POST /api/call',
    errorCode,
    message: 'This is the message',
  },
  certificateId: 'certificateId',
})

const getTestCertificate = (id: string, type?: string, version?: number, ready?: string, relations?: CertificateRelations): Certificate =>
  fakeCertificate({
    metadata: fakeCertificateMetaData({ id, type, version, readyForSign: ready, relations }),
  })

const getCertificateWithHiglightValidation = (selected: boolean): Certificate =>
  fakeCertificate({
    data: fakeRadioBooleanElement({
      id: '0',
      value: { id: 'val', selected },
      validation: [
        fakeHighlightValidation({
          questionId: '0',
          expression: '$val',
        }),
      ],
    }),
  })

describe('Test certificate middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore<RootState>

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, certificateMiddleware, utilsMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle certificateApiGenericError', () => {
    const expectedError = getExpectedError(ErrorCode.AUTHORIZATION_PROBLEM.toString())

    it('shall throw error', async () => {
      testStore.dispatch(certificateApiGenericError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction).toBeTruthy()
    })

    it('shall throw error with type ROUTE', async () => {
      testStore.dispatch(certificateApiGenericError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw error with errorCode AUTHORIZATION_PROBLEM', async () => {
      testStore.dispatch(certificateApiGenericError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.AUTHORIZATION_PROBLEM)
    })

    it('shall throw error with message if exists', async () => {
      testStore.dispatch(certificateApiGenericError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.message).toContain(expectedError.error.message)
    })

    it('shall throw error with certificateId if exists', async () => {
      testStore.dispatch(certificateApiGenericError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.certificateId).toEqual(expectedError.certificateId)
    })
  })

  describe('Handle autoSave', () => {
    const expectedError = getExpectedError(ErrorCode.UNKNOWN_INTERNAL_PROBLEM.toString())

    it('shall throw error if autosave fails', async () => {
      testStore.dispatch(autoSaveCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction).toBeTruthy()
    })

    it('shall throw error with type MODAL if autosave fails', async () => {
      testStore.dispatch(autoSaveCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.MODAL)
    })

    it('shall throw error with errorCode CONCURRENT_MODIFICATION if autosave fails with UNKNOWN_INTERNAL_PROBLEM', async () => {
      testStore.dispatch(autoSaveCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.CONCURRENT_MODIFICATION)
    })

    it('shall throw error with original errorCode if its NOT UKNOWN_INTERNAL_ERROR', async () => {
      testStore.dispatch(autoSaveCertificateError({ error: { ...expectedError.error, errorCode: ErrorCode.AUTHORIZATION_PROBLEM } }))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.AUTHORIZATION_PROBLEM)
    })
  })

  describe('Handle StartSignCertificate', () => {
    it('Should call correct endpoint for fake signin', async () => {
      const certificate = getTestCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(updateUser({ ...fakeUser(), signingMethod: SigningMethod.FAKE }))

      testStore.dispatch(startSignCertificate())

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/certificate/certificateId/sign')
      expect(fakeAxios.history.post[0].data).toBeDefined()
      expect(JSON.parse(fakeAxios.history.post[0].data)).toMatchObject({ metadata: { id: 'certificateId' }, links: [] })
    })

    it('Should call correct endpoint for DSS signin', async () => {
      const certificate = getTestCertificate('certificateId')
      certificate.metadata.type = 'certificateType'
      certificate.metadata.version = 12345
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(updateUser({ ...fakeUser(), signingMethod: SigningMethod.DSS }))

      testStore.dispatch(startSignCertificate())

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/signature/certificateType/certificateId/12345/signeringshash/SIGN_SERVICE')
    })

    it('Should call correct endpoint for bankid signin', async () => {
      const certificate = getTestCertificate('certificateId')
      certificate.metadata.type = 'certificateType'
      certificate.metadata.version = 12345
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(updateUser({ ...fakeUser(), signingMethod: SigningMethod.BANK_ID }))

      testStore.dispatch(startSignCertificate())

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/signature/certificateType/certificateId/12345/signeringshash/GRP')
    })
  })

  describe('Handle ReadyForSign', () => {
    it('shall call api to make the certificate ready for sign', async () => {
      const certificate = getTestCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(readyForSign())

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/certificate/certificateId/readyforsign')
    })
  })

  describe('Handle ReadyForSignSuccess', () => {
    it('shall update readyForSign', async () => {
      const certificate = getTestCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      const expectedReadyForSign = new Date().toISOString()
      const readyForSignCertificate = getTestCertificate('certificateId', 'lisjp', 99, expectedReadyForSign)
      testStore.dispatch(readyForSignSuccess({ certificate: readyForSignCertificate }))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate?.metadata.readyForSign).toBe(expectedReadyForSign)
    })

    it('shall update version', async () => {
      const certificate = getTestCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      const expectedVersion = 99
      const readyForSignCertificate = getTestCertificate('certificateId', 'lisjp', expectedVersion, new Date().toISOString())
      testStore.dispatch(readyForSignSuccess({ certificate: readyForSignCertificate }))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate?.metadata.version).toBe(expectedVersion)
    })
  })

  describe('Handle ComplementCertificateSuccess', () => {
    beforeEach(() => {
      fakeAxios = new MockAdapter(axios)
      testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, certificateMiddleware])
    })

    it('shall hide spinner on success', async () => {
      const certificateToComplement = getTestCertificate('id')

      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement }))
      await flushPromises()
      const updateCertificateDispatchFound = dispatchedActions.some((action) => hideSpinner.match(action))

      expect(updateCertificateDispatchFound).toBeTruthy()
    })

    it('shall route to the new certificate', async () => {
      const certificateToComplement = getTestCertificate('id')

      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement }))
      await flushPromises()

      expect(dispatchedActions.some((action) => push.match(action) && action.payload === '/certificate/id')).toBe(true)
    })
  })

  describe('Handle AnswerComplementCertificate', () => {
    it('shall update certificate when complemented', async () => {
      const certificateToComplement = getTestCertificate('originalCertificateId')
      const expectedCertificate = getTestCertificate('updatedCertificateId')
      fakeAxios
        .onPost(`/api/certificate/${certificateToComplement.metadata.id}/answercomplement`)
        .reply(200, { certificate: expectedCertificate } as ComplementCertificateSuccess)
      testStore.dispatch(updateCertificate(certificateToComplement))

      testStore.dispatch(answerComplementCertificate('Vi svarar denna komplettering med ett meddelande'))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate).toEqual(expectedCertificate)
    })
  })

  describe('Handle startSigningCertificate', () => {
    it('shall update signing data when successfully starting the signing process', async () => {
      const expectedSigningData = { id: 'testId', signRequest: 'signRequest', actionUrl: 'actionUrl' } as SigningData
      const certificate = getTestCertificate('id', 'lisjp', 2)
      testStore.dispatch(updateUser({ ...fakeUser(), signingMethod: SigningMethod.DSS }))
      testStore.dispatch(updateCertificate(certificate))

      fakeAxios
        .onPost(
          `/api/signature/${certificate.metadata.type}/${certificate.metadata.id}/${certificate.metadata.version}/signeringshash/SIGN_SERVICE`
        )
        .reply(200, expectedSigningData)

      testStore.dispatch(startSignCertificate)

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.signingData).toEqual(expectedSigningData)
    })

    it('shall make a signing request to DSS when users signing method is DSS', async () => {
      const certificate = getTestCertificate('id', 'lisjp', 2)
      testStore.dispatch(updateUser({ ...fakeUser(), signingMethod: SigningMethod.DSS }))

      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(startSignCertificate)

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
    })
  })

  describe('Handle CreateCertificateFromCandidate', () => {
    it('shall return certificate filled in certificate from candidate', async () => {
      const expectedCertificate = getTestCertificate('newCertificateId', 'ag7804')
      const createCertificateFromCandidateSuccess: CreateCertificateFromCandidateSuccess = {
        certificateId: expectedCertificate.metadata.id,
      }
      fakeAxios.onPost(`/api/certificate/${expectedCertificate.metadata.id}/candidate`).reply(200, createCertificateFromCandidateSuccess)
      testStore.dispatch(updateCertificate(expectedCertificate))

      testStore.dispatch(createCertificateFromCandidate())

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate).toEqual(expectedCertificate)
      expect(fakeAxios.history.post.length).toBe(1)
    })
  })

  describe('Handle highlight certificate data element', () => {
    it('shall highlight certificate data element', async () => {
      const certificate = getCertificateWithHiglightValidation(true)

      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(updateCertificateDataElement(certificate.data[0]))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate?.data[0].style).toEqual(CertificateDataElementStyleEnum.HIGHLIGHTED)
    })

    it('shall unstyle certificate data element', async () => {
      const certificate = getCertificateWithHiglightValidation(false)
      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(updateCertificateDataElement(certificate.data[0]))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate?.data[0].style).toEqual(CertificateDataElementStyleEnum.NORMAL)
    })
  })

  describe('handleDeleteCertificate', () => {
    it('shall set isDeleted true on successful deletion', async () => {
      const certificate = getTestCertificate('test', '', 0, '')
      testStore.dispatch(updateCertificate(certificate))
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)

      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id }))
      await flushPromises()

      const { isDeleted } = testStore.getState().ui.uiCertificate
      expect(isDeleted).toBe(true)
    })

    it('shall hide spinner on successful deletion', async () => {
      const certificate = getTestCertificate('test', '', 0, '')
      testStore.dispatch(updateCertificate(certificate))
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)

      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id }))
      expect(testStore.getState().ui.uiCertificate.spinner).toBe(true)
      await flushPromises()

      expect(testStore.getState().ui.uiCertificate.spinner).toBe(false)
    })

    it('should hide spinner on successful deletion when parent certificate exist', async () => {
      const certificate = fakeCertificate({
        metadata: fakeCertificateMetaData({
          relations: fakeCertificateRelations({ parent: fakeCertificateRelation({ certificateId: '2' }) }),
        }),
      })
      testStore.dispatch(updateCertificate(certificate))
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)

      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id }))
      expect(testStore.getState().ui.uiCertificate.spinner).toBe(true)
      await flushPromises()

      expect(testStore.getState().ui.uiCertificate.spinner).toBe(false)
    })

    it('shall set routedFromDeletedCertificate to true if parent certificate exists', async () => {
      const parentCertificate: CertificateRelation = {
        certificateId: 'parent',
        type: CertificateRelationType.RENEW,
        created: '',
        status: CertificateStatus.SIGNED,
      }
      const certificate = getTestCertificate('test', '', 0, '', { parent: parentCertificate, children: [] })
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id }))
      await flushPromises()

      const { routedFromDeletedCertificate } = testStore.getState().ui.uiCertificate
      expect(routedFromDeletedCertificate).toBe(true)
    })

    it('shall route user after successful deletion if parent certificate exists', async () => {
      const parentCertificate: CertificateRelation = {
        certificateId: 'parent',
        type: CertificateRelationType.RENEW,
        created: '',
        status: CertificateStatus.SIGNED,
      }
      const certificate = getTestCertificate('test', '', 0, '', { parent: parentCertificate, children: [] })
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id }))
      await flushPromises()

      expect(
        dispatchedActions.some((action) => replace.match(action) && action.payload === `/certificate/${parentCertificate.certificateId}`)
      ).toBe(true)
    })
  })

  describe('Handle validate certificate', () => {
    it('Should add client validationErrors when element changes', () => {
      const certificateData = fakeDateElement({ id: '1', value: fakeCertificateValue.date({ date: 'abc' }) })
      const certificate = fakeCertificate({ data: certificateData })
      testStore.dispatch(updateCertificate(certificate))

      expect(getQuestion('1')(testStore.getState())?.validationErrors).toHaveLength(0)

      testStore.dispatch(updateCertificateDataElement(certificateData['1']))
      testStore.dispatch(showValidationErrors())

      expect(getVisibleValidationErrors('1')(testStore.getState())).toMatchObject([
        {
          text: 'Ange giltigt datum i formatet åååå-mm-dd.',
          type: 'INVALID_DATE_FORMAT',
        },
      ])
    })

    it('Should update validationErrors on validateCertificateSuccess', () => {
      const certificate = fakeCertificate({
        data: fakeDateElement({ id: '1', validationErrors: [fakeCertificateValidationError({ id: '1' })] }),
      })
      const validationError = fakeCertificateValidationError({ id: '1' })

      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(validateCertificateSuccess({ validationErrors: [validationError] }))
      testStore.dispatch(showValidationErrors())

      expect(getVisibleValidationErrors('1')(testStore.getState())).toMatchObject([validationError])
    })

    it('Should halt and display careUnitValidationErrors', () => {
      const certificate = getCertificateWithHiglightValidation(false)
      const validationError = fakeCertificateValidationError({ category: 'vardenhet' })

      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(validateCertificateSuccess({ validationErrors: [validationError] }))

      expect(getCareUnitValidationErrors()(testStore.getState())).toMatchObject([validationError])

      testStore.dispatch(startSignCertificate())

      expect(getShowValidationErrors(testStore.getState())).toBe(true)
    })

    it('Should halt and display patientValidationErrors', () => {
      const certificate = getCertificateWithHiglightValidation(false)
      const validationError = fakeCertificateValidationError({ category: 'patient' })

      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(validateCertificateSuccess({ validationErrors: [validationError] }))

      expect(getPatientValidationErrors()(testStore.getState())).toMatchObject([validationError])

      testStore.dispatch(startSignCertificate())

      expect(getShowValidationErrors(testStore.getState())).toBe(true)
    })
  })

  describe('Handle create certificate', () => {
    it('should call api to create certificate', async () => {
      testStore.dispatch(
        createNewCertificate({
          certificateType: 'lisjp',
          patientId: '191212121212',
        })
      )

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
    })

    it('should update certificate id after api call', async () => {
      const data: CreateCertificate = {
        certificateType: 'lisjp',
        patientId: '191212121212',
      }
      const response: CreateCertificateResponse = {
        certificateId: 'certificateId',
      }

      fakeAxios.onPost(`/api/certificate/${data.certificateType}/${data.patientId}`).reply(200, response)

      testStore.dispatch(createNewCertificate(data))

      await flushPromises()
      const { createdCertificateId } = testStore.getState().ui.uiCertificate
      expect(createdCertificateId).toEqual(response.certificateId)
    })
  })

  describe('Should handle failed session poll request', () => {
    it('Should reset certificate information on session error', () => {
      const certificate = getTestCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      expect(testStore.getState().ui.uiCertificate.certificate).toEqual(certificate)

      testStore.dispatch(
        getSessionStatusError({
          error: {
            api: 'api',
            errorCode: 'errorCode',
            message: 'message',
          },
        })
      )

      expect(testStore.getState().ui.uiCertificate.certificate).toBeUndefined()
    })
  })

  describe('Should handle sign certificate error', () => {
    it('shall throw error with type modal', async () => {
      const thrownError = getExpectedError(ErrorCode.PU_PROBLEM)
      testStore.dispatch(signCertificateStatusError(thrownError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.MODAL)
    })

    it('shall throw error with code SIGN_CERTIFICATE_ERROR', async () => {
      const thrownError = getExpectedError(ErrorCode.PU_PROBLEM)
      testStore.dispatch(signCertificateStatusError(thrownError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.SIGN_CERTIFICATE_ERROR.toString())
    })

    it('shall throw error with certificate id', async () => {
      const thrownError = getExpectedError(ErrorCode.PU_PROBLEM)
      testStore.dispatch(signCertificateStatusError(thrownError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.certificateId).toEqual(thrownError.certificateId)
    })
  })

  describe('Should handle GetCertificateError', () => {
    it('shall throw error if get certificate replies with error', async () => {
      fakeAxios.onPost('/api/certificate/certificateId').reply(500, null)

      testStore.dispatch(getCertificate('certificateId'))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction).toBeTruthy()
    })

    it('shall throw route error if get certificate replies with error', async () => {
      fakeAxios.onPost('/api/certificate/certificateId').reply(500, null)

      testStore.dispatch(getCertificate('certificateId'))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw GET_CERTIFICATE_PROBLEM error if get certificate replies with error', async () => {
      fakeAxios.onPost('/api/certificate/certificateId').reply(500, null)

      testStore.dispatch(getCertificate('certificateId'))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.GET_CERTIFICATE_PROBLEM)
    })

    it('shall throw DATA_NOT_FOUND error', async () => {
      const expectedError = getExpectedError(ErrorCode.DATA_NOT_FOUND.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.DATA_NOT_FOUND)
    })

    it('shall throw DATA_NOT_FOUND error with type Route', async () => {
      const expectedError = getExpectedError(ErrorCode.DATA_NOT_FOUND.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET error', async () => {
      const expectedError = getExpectedError(ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET)
    })

    it('shall throw AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET error with type Route', async () => {
      const expectedError = getExpectedError(ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw AUTHORIZATION_PROBLEM error', async () => {
      const expectedError = getExpectedError(ErrorCode.AUTHORIZATION_PROBLEM.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.AUTHORIZATION_PROBLEM)
    })

    it('shall throw AUTHORIZATION_PROBLEM error with type Route', async () => {
      const expectedError = getExpectedError(ErrorCode.AUTHORIZATION_PROBLEM.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw INVALID_LAUNCHID error', async () => {
      const expectedError = getExpectedError(ErrorCode.INVALID_LAUNCHID.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.INVALID_LAUNCHID)
    })

    it('shall throw INVALID_LAUNCHID error with type Route', async () => {
      const expectedError = getExpectedError(ErrorCode.INVALID_LAUNCHID.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw GET_CERTIFICATE_PROBLEM error', async () => {
      const expectedError = getExpectedError(ErrorCode.GET_CERTIFICATE_PROBLEM.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.GET_CERTIFICATE_PROBLEM)
    })

    it('shall throw GET_CERTIFICATE_PROBLEM error with type Route', async () => {
      const expectedError = getExpectedError(ErrorCode.GET_CERTIFICATE_PROBLEM.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw GET_CERTIFICATE_PROBLEM error if id does not match any specific error code', async () => {
      const expectedError = getExpectedError(ErrorCode.INTERNAL_PROBLEM.toString())

      testStore.dispatch(getCertificateError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.GET_CERTIFICATE_PROBLEM)
    })
  })
})
