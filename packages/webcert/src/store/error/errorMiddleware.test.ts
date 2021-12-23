import { AnyAction, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import { errorMiddleware } from './errorMiddleware'
import { setActiveCertificateId, throwError } from './errorActions'
import { ErrorCode, ErrorData, ErrorRequest, ErrorType } from './errorReducer'
import { updateCertificate } from '../certificate/certificateActions'
import { getCertificate } from '@frontend/common'
import { apiCallBegan } from '../api/apiActions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test error middleware', () => {
  let testStore: EnhancedStore

  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, errorMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle create error', () => {
    it('shall create errorData with same type', async () => {
      const error: ErrorRequest = { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.type).toEqual(error.type)
    })

    it('shall create errorData with same errorCode', async () => {
      const error: ErrorRequest = { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.errorCode).toEqual(error.errorCode)
    })

    it('shall create errorData with message if included', async () => {
      const error: ErrorRequest = { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL, certificateId: 'certificateId' }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.certificateId).toEqual(error.certificateId)
    })

    it('shall create errorData with same stacktrace', async () => {
      const error: ErrorRequest = { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL, stackTrace: new Error().stack }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.stackTrace).toEqual(error.stackTrace)
    })

    it('shall create errorData with certificateId if included', async () => {
      const error: ErrorRequest = { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL, certificateId: 'certificateId' }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.certificateId).toEqual(error.certificateId)
    })

    it('shall create errorData with certificateId if its not included but available', async () => {
      const expectedCertificateId = 'activeCertificateId'
      testStore.dispatch(setActiveCertificateId(expectedCertificateId))

      const error: ErrorRequest = { errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.certificateId).toEqual(expectedCertificateId)
    })

    it('shall generate an errorId', async () => {
      testStore.dispatch(throwError({ errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.errorId).toBeTruthy()
    })

    it('shall use correct log api when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }))

      await flushPromises()
      const apiCallBeganAction: AnyAction | undefined = dispatchedActions.find((action) => apiCallBegan.match(action))
      expect(apiCallBeganAction?.payload.url).toEqual('/api/log/error')
    })

    it('shall include errorId when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }))

      await flushPromises()
      const error: ErrorData = testStore.getState().ui.uiError.error
      const apiCallBeganAction: AnyAction | undefined = dispatchedActions.find((action) => apiCallBegan.match(action))
      expect(apiCallBeganAction?.payload.data.errorId).toEqual(error.errorId)
    })

    it('shall include errorCode when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }))

      await flushPromises()
      const error: ErrorData = testStore.getState().ui.uiError.error
      const apiCallBeganAction: AnyAction | undefined = dispatchedActions.find((action) => apiCallBegan.match(action))
      expect(apiCallBeganAction?.payload.data.errorCode).toEqual(error.errorCode)
    })

    it('shall include certificateId when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }))

      await flushPromises()
      const error: ErrorData = testStore.getState().ui.uiError.error
      const apiCallBeganAction: AnyAction | undefined = dispatchedActions.find((action) => apiCallBegan.match(action))
      expect(apiCallBeganAction?.payload.data.certificateId).toEqual(error.certificateId)
    })

    it('shall include stacktrace when logging error', async () => {
      const expectedErrorRequest: ErrorRequest = {
        errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM,
        type: ErrorType.MODAL,
        stackTrace: new Error().stack,
      }
      testStore.dispatch(throwError(expectedErrorRequest))

      await flushPromises()
      const apiCallBeganAction: AnyAction | undefined = dispatchedActions.find((action) => apiCallBegan.match(action))
      expect(apiCallBeganAction?.payload.data.stackTrace).toEqual(expectedErrorRequest.stackTrace)
    })

    it('shall include passed message when logging error', async () => {
      const expectedErrorRequest: ErrorRequest = {
        errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM,
        message: 'This is the message',
        type: ErrorType.MODAL,
        stackTrace: new Error().stack,
      }
      testStore.dispatch(throwError(expectedErrorRequest))

      await flushPromises()
      const apiCallBeganAction: AnyAction | undefined = dispatchedActions.find((action) => apiCallBegan.match(action))
      expect(apiCallBeganAction?.payload.data.message).toEqual(expectedErrorRequest.message)
    })

    it('shall create message when missing when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.MODAL }))

      await flushPromises()
      const apiCallBeganAction: AnyAction | undefined = dispatchedActions.find((action) => apiCallBegan.match(action))
      expect(apiCallBeganAction?.payload.data.message).toBeTruthy()
    })

    it('shall NOT store Error in state if it has type SILENT', async () => {
      testStore.dispatch(throwError({ errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, type: ErrorType.SILENT }))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error).toBeFalsy()
    })
  })

  describe('Handle update certificate', () => {
    it('shall store currently active certificate id', async () => {
      const expectedCertificateId = 'expectedCertificateId'
      const certificate = getCertificate()
      certificate.metadata.id = expectedCertificateId
      testStore.dispatch(updateCertificate(certificate))

      await flushPromises()
      expect(testStore.getState().ui.uiError.activeCertificateId).toEqual(expectedCertificateId)
    })
  })
})
