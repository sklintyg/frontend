import {
  Certificate,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateDataValidation,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateMetadata,
  CertificateRelation,
  CertificateRelations,
  CertificateRelationType,
  CertificateStatus,
  ConfigTypes,
  getUser,
  SigningMethod,
  ValidationError,
  ValueBoolean,
} from '@frontend/common'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { apiMiddleware } from '../api/apiMiddleware'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import { updateUser } from '../user/userActions'
import {
  answerComplementCertificate,
  autoSaveCertificateError,
  certificateApiGenericError,
  complementCertificate,
  complementCertificateSuccess,
  ComplementCertificateSuccess,
  CreateCertificate,
  createCertificateFromCandidate,
  CreateCertificateFromCandidateSuccess,
  CreateCertificateResponse,
  createNewCertificate,
  deleteCertificate,
  hideCertificateDataElement,
  hideSpinner,
  readyForSign,
  readyForSignSuccess,
  showCertificateDataElement,
  SigningData,
  startSignCertificate,
  updateCertificate,
  updateClientValidationError,
  updateValidationErrors,
  validateCertificate,
  validateCertificateInFrontEnd,
} from './certificateActions'
import { certificateMiddleware } from './certificateMiddleware'

import { throwError } from '../error/errorActions'
import { ErrorCode, ErrorType } from '../error/errorReducer'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const mockHistory = {
  push: jest.fn(),
}

describe('Test certificate middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, certificateMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle certificateApiGenericError', () => {
    const expectedError = {
      error: {
        api: 'POST /api/call',
        errorCode: 'AUTHORIZATION_PROBLEM',
        message: 'This is the message',
      },
      certificateId: 'certificateId',
    }

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

  describe('Handle autoSave error', () => {
    const expectedError = {
      error: {
        api: 'POST /api/call',
        errorCode: 'UNKNOWN_INTERNAL_PROBLEM',
        message: 'This is the message',
      },
    }

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
      const certificate = getCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(updateUser({ ...getUser(), signingMethod: SigningMethod.FAKE }))

      testStore.dispatch(startSignCertificate())

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/certificate/certificateId/sign')
      expect(fakeAxios.history.post[0].data).toEqual('{"metadata":{"id":"certificateId"},"links":[]}')
    })

    it('Should call correct endpoint for DSS signin', async () => {
      const certificate = getCertificate('certificateId')
      certificate.metadata.type = 'certificateType'
      certificate.metadata.version = 12345
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(updateUser({ ...getUser(), signingMethod: SigningMethod.DSS }))

      testStore.dispatch(startSignCertificate())

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/signature/certificateType/certificateId/12345/signeringshash/SIGN_SERVICE')
    })

    it('Should call correct endpoint for bankid signin', async () => {
      const certificate = getCertificate('certificateId')
      certificate.metadata.type = 'certificateType'
      certificate.metadata.version = 12345
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(updateUser({ ...getUser(), signingMethod: SigningMethod.BANK_ID }))

      testStore.dispatch(startSignCertificate())

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/signature/certificateType/certificateId/12345/signeringshash/GRP')
    })
  })

  describe('Handle ReadyForSign', () => {
    it('shall call api to make the certificate ready for sign', async () => {
      const certificate = getCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      testStore.dispatch(readyForSign())

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/certificate/certificateId/readyforsign')
    })
  })

  describe('Handle ReadyForSignSuccess', () => {
    it('shall update readyForSign', async () => {
      const certificate = getCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      const expectedReadyForSign = new Date().toISOString()
      const readyForSignCertificate = getCertificate('certificateId', 'lisjp', 99, expectedReadyForSign)
      testStore.dispatch(readyForSignSuccess({ certificate: readyForSignCertificate }))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.metadata.readyForSign).toBe(expectedReadyForSign)
    })

    it('shall update version', async () => {
      const certificate = getCertificate('certificateId')
      testStore.dispatch(updateCertificate(certificate))

      const expectedVersion = 99
      const readyForSignCertificate = getCertificate('certificateId', 'lisjp', expectedVersion, new Date().toISOString())
      testStore.dispatch(readyForSignSuccess({ certificate: readyForSignCertificate }))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.metadata.version).toBe(expectedVersion)
    })
  })

  describe('Handle ComplementCertificate', () => {
    xit('shall update certificate when complemented', async () => {
      const certificateToComplement = getCertificate('originalCertificateId')
      const expectedCertificate = getCertificate('newCertificateId')
      const complementCertificateSuccess = { certificate: expectedCertificate } as ComplementCertificateSuccess
      fakeAxios.onPost(`/api/certificate/${certificateToComplement.metadata.id}/complement`).reply(200, complementCertificateSuccess)
      testStore.dispatch(updateCertificate(certificateToComplement))

      // @ts-expect-error mocking history
      testStore.dispatch(complementCertificate({ message: '', history: mockHistory }))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate).toEqual(expectedCertificate)
    })
  })

  describe('Handle ComplementCertificateSuccess', () => {
    beforeEach(() => {
      fakeAxios = new MockAdapter(axios)
      testStore = configureStore({
        reducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, certificateMiddleware),
      })
    })

    xit('shall update certificate on success', async () => {
      const certificateToComplement = getCertificate('id')

      // @ts-expect-error mocking history
      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement, history: mockHistory }))
      await flushPromises()
      const updateCertificateDispatchFound = dispatchedActions.some((action) => updateCertificate.match(action))

      expect(updateCertificateDispatchFound).toBeTruthy()
    })

    xit('shall validate certificate on success', async () => {
      const certificateToComplement = getCertificate('id')

      // @ts-expect-error mocking history
      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement, history: mockHistory }))
      await flushPromises()

      const validateAction = dispatchedActions.find((action) => validateCertificate.match(action))
      expect(validateAction).toBeTruthy()
    })

    it('shall hide spinner on success', async () => {
      const certificateToComplement = getCertificate('id')

      // @ts-expect-error mocking history
      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement, history: mockHistory }))
      await flushPromises()
      const updateCertificateDispatchFound = dispatchedActions.some((action) => hideSpinner.match(action))

      expect(updateCertificateDispatchFound).toBeTruthy()
    })

    it('shall route to the new certificate', async () => {
      mockHistory.push.mockClear()
      const certificateToComplement = getCertificate('id')

      // @ts-expect-error mocking history
      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement, history: mockHistory }))
      await flushPromises()

      expect(mockHistory.push).toHaveBeenCalledWith(`/certificate/id`)
    })

    xit('shall get certificate events on success', async () => {
      const certificateToComplement = getCertificate('id')

      // @ts-expect-error mocking history
      testStore.dispatch(complementCertificateSuccess({ certificate: certificateToComplement, history: mockHistory }))
      await flushPromises()

      expect(fakeAxios.history.get.some((req) => req.url?.includes('events'))).toBeTruthy()
    })
  })

  describe('Handle AnswerComplementCertificate', () => {
    it('shall update certificate when complemented', async () => {
      const certificateToComplement = getCertificate('originalCertificateId')
      const expectedCertificate = getCertificate('updatedCertificateId')
      const complementCertificateSuccess = { certificate: expectedCertificate } as ComplementCertificateSuccess
      fakeAxios.onPost(`/api/certificate/${certificateToComplement.metadata.id}/answercomplement`).reply(200, complementCertificateSuccess)
      testStore.dispatch(updateCertificate(certificateToComplement))

      testStore.dispatch(answerComplementCertificate('Vi svarar denna komplettering med ett meddelande'))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate).toEqual(expectedCertificate)
    })
  })

  describe('Handle startSigningCertificate', () => {
    it('shall update signing data when successfully starting the signing process', async () => {
      const expectedSigningData = { id: 'testId', signRequest: 'signRequest', actionUrl: 'actionUrl' } as SigningData
      const certificate = getCertificate('id', 'lisjp', 2)
      testStore.dispatch(updateUser({ ...getUser(), signingMethod: SigningMethod.DSS }))
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
      const certificate = getCertificate('id', 'lisjp', 2)
      testStore.dispatch(updateUser({ ...getUser(), signingMethod: SigningMethod.DSS }))

      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(startSignCertificate)

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
    })
  })

  describe('Handle CreateCertificateFromCandidate', () => {
    it('shall return certificate filled in certificate from candidate', async () => {
      const expectedCertificate = getCertificate('newCertificateId', 'ag7804')
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
      testStore.dispatch(validateCertificateInFrontEnd(certificate.data[0]))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.data[0].style).toEqual(CertificateDataElementStyleEnum.HIGHLIGHTED)
    })

    it('shall unstyle certificate data element', async () => {
      const certificate = getCertificateWithHiglightValidation(false)
      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(validateCertificateInFrontEnd(certificate.data[0]))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.data[0].style).toEqual(CertificateDataElementStyleEnum.NORMAL)
    })
  })

  describe('handleDeleteCertificate', () => {
    it('shall set isDeleted true on successful deletion', async () => {
      const certificate = getCertificate('test', '', 0, '', undefined)
      testStore.dispatch(updateCertificate(certificate))
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)

      // @ts-expect-error mocking history
      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id, history: mockHistory }))
      await flushPromises()

      const isDeleted = testStore.getState().ui.uiCertificate.isDeleted
      expect(isDeleted).toBe(true)
    })

    it('shall hide spinner on successful deletion', async () => {
      const certificate = getCertificate('test', '', 0, '', undefined)
      testStore.dispatch(updateCertificate(certificate))
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)

      // @ts-expect-error mocking history
      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id, history: mockHistory }))
      await flushPromises()

      const spinnerActive = testStore.getState().ui.uiCertificate.spinner
      expect(spinnerActive).toBe(false)
    })

    it('shall set routedFromDeletedCertificate to true if parent certificate exists', async () => {
      mockHistory.push.mockClear()
      const parentCertificate: CertificateRelation = {
        certificateId: 'parent',
        type: CertificateRelationType.RENEW,
        created: '',
        status: CertificateStatus.SIGNED,
      }
      const certificate = getCertificate('test', '', 0, '', { parent: parentCertificate, children: [] })
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)
      testStore.dispatch(updateCertificate(certificate))

      // @ts-expect-error mocking history
      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id, history: mockHistory }))
      await flushPromises()

      const routedFromDeletedCertificate = testStore.getState().ui.uiCertificate.routedFromDeletedCertificate
      expect(routedFromDeletedCertificate).toBe(true)
    })

    it('shall route user after successful deletion if parent certificate exists', async () => {
      mockHistory.push.mockClear()
      const parentCertificate: CertificateRelation = {
        certificateId: 'parent',
        type: CertificateRelationType.RENEW,
        created: '',
        status: CertificateStatus.SIGNED,
      }
      const certificate = getCertificate('test', '', 0, '', { parent: parentCertificate, children: [] })
      fakeAxios.onDelete(`/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}`).reply(200)
      testStore.dispatch(updateCertificate(certificate))

      // @ts-expect-error mocking history
      testStore.dispatch(deleteCertificate({ certificateId: certificate.metadata.id, history: mockHistory }))
      await flushPromises()

      expect(mockHistory.push).toHaveBeenCalledWith(`/certificate/${parentCertificate.certificateId}`)
    })
  })

  describe('Update client validation errors', () => {
    const validationError: ValidationError = {
      type: 'ERROR',
      text: 'test',
      field: 'field',
      id: 'id',
      category: 'category',
    }
    const otherValidationError: ValidationError = {
      type: 'ERROR_2',
      text: 'test',
      field: 'field',
      id: 'id',
      category: 'category',
    }

    it('should add validation message if it does not exist', () => {
      testStore.dispatch(updateClientValidationError({ validationError: validationError, shouldBeRemoved: false }))
      expect(testStore.getState().ui.uiCertificate.clientValidationErrors).toHaveLength(1)
    })

    it('should remove validation message if remove flag is sent', () => {
      testStore.dispatch(updateClientValidationError({ validationError: validationError, shouldBeRemoved: true }))
      expect(testStore.getState().ui.uiCertificate.clientValidationErrors).toHaveLength(0)
    })

    it('should not add validation message if it already exists', () => {
      testStore.dispatch(updateClientValidationError({ validationError: validationError, shouldBeRemoved: false }))
      testStore.dispatch(updateClientValidationError({ validationError: validationError, shouldBeRemoved: false }))
      expect(testStore.getState().ui.uiCertificate.clientValidationErrors).toHaveLength(1)
    })

    it('should add several validation messages', () => {
      testStore.dispatch(updateClientValidationError({ validationError: validationError, shouldBeRemoved: false }))
      testStore.dispatch(updateClientValidationError({ validationError: otherValidationError, shouldBeRemoved: false }))
      expect(testStore.getState().ui.uiCertificate.clientValidationErrors).toHaveLength(2)
    })

    it('should remove only one validation message if flag is sent', () => {
      testStore.dispatch(updateClientValidationError({ validationError: otherValidationError, shouldBeRemoved: false }))
      testStore.dispatch(updateClientValidationError({ validationError: validationError, shouldBeRemoved: false }))
      testStore.dispatch(updateClientValidationError({ validationError: otherValidationError, shouldBeRemoved: true }))
      expect(testStore.getState().ui.uiCertificate.clientValidationErrors).toHaveLength(1)
      expect(testStore.getState().ui.uiCertificate.clientValidationErrors[0].type).toEqual('ERROR')
    })
  })

  describe('Handle Validate certificates in frontend', () => {
    describe('Show validation', () => {
      it('should throw hide action when hidden', async () => {
        const certificate = getCertificateWithValidation(false, CertificateDataValidationType.SHOW_VALIDATION)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const hideCertificateDataElementAction = dispatchedActions.find((action) => hideCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction && hideCertificateDataElementAction.payload).toBe('1.2')
      })

      it('should throw show action when hidden', async () => {
        const certificate = getCertificateWithValidation(true, CertificateDataValidationType.SHOW_VALIDATION)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const showCertificateDataElementAction = dispatchedActions.find((action) => showCertificateDataElement.match(action))
        expect(showCertificateDataElementAction && showCertificateDataElementAction.payload).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is hidden ', async () => {
        const certificate = getCertificateWithValidation(false, CertificateDataValidationType.SHOW_VALIDATION)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is shown ', async () => {
        const certificate = getCertificateWithValidation(true, CertificateDataValidationType.SHOW_VALIDATION)
        certificate.data['1.2'].visible = false
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })
    })

    describe('Hide Validation', () => {
      it('should throw hide action when visible', async () => {
        const certificate = getCertificateWithValidation(true, CertificateDataValidationType.HIDE_VALIDATION)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const hideCertificateDataElementAction = dispatchedActions.find((action) => hideCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction && hideCertificateDataElementAction.payload).toBe('1.2')
      })

      it('should throw unhide action when hidden', async () => {
        const certificate = getCertificateWithValidation(false, CertificateDataValidationType.HIDE_VALIDATION)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const showCertificateDataElementAction = dispatchedActions.find((action) => showCertificateDataElement.match(action))
        expect(showCertificateDataElementAction && showCertificateDataElementAction.payload).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is visible ', async () => {
        const certificate = getCertificateWithValidation(true, CertificateDataValidationType.HIDE_VALIDATION)
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })

      it('should trigger another frontend validation if the element is shown ', async () => {
        const certificate = getCertificateWithValidation(true, CertificateDataValidationType.HIDE_VALIDATION)
        certificate.data['1.2'].visible = true
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const numberOfValidateCertificateInFrontend = dispatchedActions.filter((action) => validateCertificateInFrontEnd.match(action))
        expect(numberOfValidateCertificateInFrontend.length).toBe(2)
        expect(numberOfValidateCertificateInFrontend[0].payload.id).toBe('1.1')
        expect(numberOfValidateCertificateInFrontend[1].payload.id).toBe('1.2')
      })
    })

    describe('Show and Hide validation', () => {
      it('should throw hide action when both hide and show is present and validates true', async () => {
        const certificate = getCertificateWithArrayOfValidations(true, [
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ])
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(1)
        expect(showCertificateDataElementAction.length).toBe(0)
      })

      it('should throw hide action when both hide and show is present but only hide validates true', async () => {
        const certificate = getCertificateWithArrayOfValidations(true, [
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '!$haveValue' },
        ])
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()

        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(1)
        expect(showCertificateDataElementAction.length).toBe(0)
      })

      it('should throw show action when both hide and show is present but only show validates true', async () => {
        const certificate = getCertificateWithArrayOfValidations(true, [
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '!$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ])
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })

      it('should throw hide action when both hide and show is present and validates false', async () => {
        const certificate = getCertificateWithArrayOfValidations(false, [
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ])
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })

      it('should throw show action when two hide validations is present and validates false', async () => {
        const certificate = getCertificateWithArrayOfValidations(true, [
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '!$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.HIDE_VALIDATION, expression: '!$haveValue' },
        ])
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })

      it('should throw show action when two show validations is present and one validates false and one true', async () => {
        const certificate = getCertificateWithArrayOfValidations(false, [
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '!$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ])
        ;(certificate.data['1.2'].value as ValueBoolean).selected = true
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })
      it('should throw one show action when two show validations is present that validates true', async () => {
        const certificate = getCertificateWithArrayOfValidations(true, [
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
          { questionId: '1.1', type: CertificateDataValidationType.SHOW_VALIDATION, expression: '$haveValue' },
        ])
        testStore.dispatch(updateCertificate(certificate))

        testStore.dispatch(validateCertificateInFrontEnd(certificate.data['1.1']))

        await flushPromises()
        const hideCertificateDataElementAction = dispatchedActions.filter((action) => hideCertificateDataElement.match(action))
        const showCertificateDataElementAction = dispatchedActions.filter((action) => showCertificateDataElement.match(action))
        expect(hideCertificateDataElementAction.length).toBe(0)
        expect(showCertificateDataElementAction.length).toBe(1)
      })
    })
  })

  describe('Handle sign certificate', () => {
    const validationError: ValidationError = {
      type: 'ERROR',
      text: 'test',
      field: 'field',
      id: '0',
      category: 'category',
    }

    it('should halt and display validation errors', () => {
      const certificate = getCertificateWithHiglightValidation(false)
      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(updateClientValidationError({ validationError: validationError, shouldBeRemoved: false }))

      expect(testStore.getState().ui.uiCertificate.showValidationErrors).toBe(false)
      testStore.dispatch(startSignCertificate())
      expect(testStore.getState().ui.uiCertificate.showValidationErrors).toBe(true)
    })

    it('should halt and display careUnitValidationErrors', () => {
      const certificate = getCertificateWithHiglightValidation(false)
      testStore.dispatch(updateCertificate(certificate))
      testStore.dispatch(updateValidationErrors([{ category: 'vardenhet', field: 'field', text: 'text', type: 'EMPTY', id: '1' }]))

      testStore.dispatch(startSignCertificate())
      expect(testStore.getState().ui.uiCertificate.showValidationErrors).toBe(true)
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
      const createdCertificateId = testStore.getState().ui.uiCertificate.createdCertificateId
      expect(createdCertificateId).toEqual(response.certificateId)
    })
  })
})

export const getCertificate = (
  id: string,
  type?: string,
  version?: number,
  readyForSign?: string,
  relations?: CertificateRelations
): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: { id, type, version, readyForSign, relations: relations },
    links: [],
  }
}

const getCertificateWithHiglightValidation = (selected: boolean): Certificate => {
  return {
    metadata: { id: 'id', type: 'type', version: 0 } as CertificateMetadata,
    data: {
      '0': ({
        id: '0',
        readOnly: false,
        parent: '0',
        index: 1,
        visible: true,
        mandatory: false,
        config: {
          text: '',
          description: '',
          type: (null as unknown) as ConfigTypes,
        },
        value: {
          type: CertificateDataValueType.BOOLEAN,
          selected: selected,
        },
        validation: [
          {
            questionId: '0',
            type: CertificateDataValidationType.HIGHLIGHT_VALIDATION,
            expression: '$0',
          },
        ],
      } as unknown) as CertificateDataElement,
    },
    links: [],
  }
}
const getCertificateWithValidation = (selected: boolean, validationType: CertificateDataValidationType): Certificate => {
  return {
    metadata: { id: 'id', type: 'type', version: 0 } as CertificateMetadata,
    data: {
      '1.1': ({
        id: '1.1',
        readOnly: false,
        parent: '1',
        index: 1,
        visible: true,
        mandatory: false,
        config: {
          text: '',
          description: '',
          type: (null as unknown) as ConfigTypes,
        },
        value: {
          type: CertificateDataValueType.BOOLEAN,
          selected: selected,
          id: 'haveValue',
        },
        validation: [],
      } as unknown) as CertificateDataElement,
      '1.2': ({
        id: '1.2',
        readOnly: false,
        parent: '1',
        index: 2,
        visible: true,
        mandatory: false,
        config: {
          text: '',
          description: '',
          type: (null as unknown) as ConfigTypes,
        },
        value: {
          type: CertificateDataValueType.BOOLEAN,
          selected: selected,
        },
        validation: [
          {
            questionId: '1.1',
            type: validationType,
            expression: '$haveValue',
          },
        ],
      } as unknown) as CertificateDataElement,
    },
    links: [],
  }
}
const getCertificateWithArrayOfValidations = (selected: boolean, validation: CertificateDataValidation[]): Certificate => {
  return {
    metadata: { id: 'id', type: 'type', version: 0 } as CertificateMetadata,
    data: {
      '1.1': ({
        id: '1.1',
        readOnly: false,
        parent: '1',
        index: 1,
        visible: true,
        mandatory: false,
        config: {
          text: '',
          description: '',
          type: (null as unknown) as ConfigTypes,
        },
        value: {
          type: CertificateDataValueType.BOOLEAN,
          selected: selected,
          id: 'haveValue',
        },
        validation: [],
      } as unknown) as CertificateDataElement,
      '1.2': ({
        id: '1.2',
        readOnly: false,
        parent: '1',
        index: 2,
        visible: true,
        mandatory: false,
        config: {
          text: '',
          description: '',
          type: (null as unknown) as ConfigTypes,
        },
        value: {
          type: CertificateDataValueType.BOOLEAN,
          selected: selected,
          id: 'haveValue',
        },
        validation,
      } as unknown) as CertificateDataElement,
    },
    links: [],
  }
}
