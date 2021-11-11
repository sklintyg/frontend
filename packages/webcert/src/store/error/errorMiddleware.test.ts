import MockAdapter from 'axios-mock-adapter'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import apiMiddleware from '../api/apiMiddleware'
import { errorMiddleware } from './errorMiddleware'
import { throwError, setActiveCertificateId } from './errorActions'
import { ErrorData, ErrorRequest, ErrorType } from './errorReducer'
import { updateCertificate } from '../certificate/certificateActions'
import { getCertificate } from '@frontend/common'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test session middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, errorMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle create error', () => {
    it('shall create errorData with same type', async () => {
      const error: ErrorRequest = { errorCode: 'errorCode', type: ErrorType.MODAL }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.type).toEqual(error.type)
    })

    it('shall create errorData with same errorCode', async () => {
      const error: ErrorRequest = { errorCode: 'errorCode', type: ErrorType.MODAL }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.errorCode).toEqual(error.errorCode)
    })

    it('shall create errorData with same stacktrace', async () => {
      const error: ErrorRequest = { errorCode: 'errorCode', type: ErrorType.MODAL, stackTrace: new Error().stack }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.stackTrace).toEqual(error.stackTrace)
    })

    it('shall create errorData with certificateId if included', async () => {
      const error: ErrorRequest = { errorCode: 'errorCode', type: ErrorType.MODAL, certificateId: 'certificateId' }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.certificateId).toEqual(error.certificateId)
    })

    it('shall create errorData with certificateId if its not included but available', async () => {
      const expectedCertificateId = 'activeCertificateId'
      testStore.dispatch(setActiveCertificateId(expectedCertificateId))

      const error: ErrorRequest = { errorCode: 'errorCode', type: ErrorType.MODAL }
      testStore.dispatch(throwError(error))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.certificateId).toEqual(expectedCertificateId)
    })

    it('shall generate an errorId', async () => {
      testStore.dispatch(throwError({ errorCode: 'errorCode', type: ErrorType.MODAL }))

      await flushPromises()
      expect(testStore.getState().ui.uiError.error.errorId).toBeTruthy()
    })

    it('shall use correct log api when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: 'errorCode', type: ErrorType.MODAL }))

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/log/error')
    })

    it('shall include errorId when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: 'errorCode', type: ErrorType.MODAL }))

      await flushPromises()
      const error: ErrorData = testStore.getState().ui.uiError.error
      expect(JSON.parse(fakeAxios.history.post[0].data).errorId).toEqual(error.errorId)
    })

    it('shall include errorCode when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: 'errorCode', type: ErrorType.MODAL }))

      await flushPromises()
      const error: ErrorData = testStore.getState().ui.uiError.error
      expect(JSON.parse(fakeAxios.history.post[0].data).errorCode).toEqual(error.errorCode)
    })

    it('shall include certificateId when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: 'errorCode', type: ErrorType.MODAL }))

      await flushPromises()
      const error: ErrorData = testStore.getState().ui.uiError.error
      expect(JSON.parse(fakeAxios.history.post[0].data).certificateId).toEqual(error.certificateId)
    })

    it('shall include stacktrace when logging error', async () => {
      const expectedErrorRequest: ErrorRequest = { errorCode: 'errorCode', type: ErrorType.MODAL, stackTrace: new Error().stack }
      testStore.dispatch(throwError(expectedErrorRequest))

      await flushPromises()
      expect(JSON.parse(fakeAxios.history.post[0].data).stackTrace).toEqual(expectedErrorRequest.stackTrace)
    })

    it('shall include a message when logging error', async () => {
      testStore.dispatch(throwError({ errorCode: 'errorCode', type: ErrorType.MODAL }))

      await flushPromises()
      expect(JSON.parse(fakeAxios.history.post[0].data).message).toBeTruthy()
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
