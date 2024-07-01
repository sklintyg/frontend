import {
  createConcurrencyErrorRequestFromApiError,
  createErrorRequestFromApiError,
  createErrorRequestTimeout,
  createSilentErrorRequestFromApiError,
} from './errorCreator'
import { ErrorCode, ErrorType } from './types'

describe('Test errorCreator', () => {
  describe('createConcurrencyErrorRequestFromApiError', () => {
    it('always create ErrorRequest with errorCode CONCURRENT_MODIFICATION', () => {
      const actualErrorRequest = createConcurrencyErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.errorCode).toEqual(ErrorCode.CONCURRENT_MODIFICATION)
    })

    it('shall include api in message', () => {
      const actualErrorRequest = createConcurrencyErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.message).toContain('POST /api/call')
    })

    it('shall include message in message', () => {
      const actualErrorRequest = createConcurrencyErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.message).toContain('There was an error!')
    })

    it('shall include certificateId', () => {
      const actualErrorRequest = createConcurrencyErrorRequestFromApiError(
        {
          api: 'POST /api/call',
          errorCode: 'UNEXPECTED_ERROR',
          message: 'There was an error!',
        },
        'certificateId'
      )
      expect(actualErrorRequest.certificateId).toEqual('certificateId')
    })
  })

  describe('createSilentErrorRequestFromApiError', () => {
    it('always create ErrorRequest with type SILENT', () => {
      const actualErrorRequest = createSilentErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.type).toEqual(ErrorType.SILENT)
    })

    it('always create ErrorRequest with errorCode', () => {
      const actualErrorRequest = createSilentErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.errorCode).toEqual(ErrorCode.UNEXPECTED_ERROR)
    })

    it('shall include api in message', () => {
      const actualErrorRequest = createSilentErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.message).toContain('POST /api/call')
    })

    it('shall include message in message', () => {
      const actualErrorRequest = createSilentErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.message).toContain('There was an error!')
    })

    it('shall include certificateId', () => {
      const actualErrorRequest = createSilentErrorRequestFromApiError(
        {
          api: 'POST /api/call',
          errorCode: 'UNEXPECTED_ERROR',
          message: 'There was an error!',
        },
        'certificateId'
      )
      expect(actualErrorRequest.certificateId).toEqual('certificateId')
    })
  })

  describe('createErrorRequestFromApiError', () => {
    it('shall create ErrorRequest with ROUTE if errorCode is TIMEOUT', () => {
      const actualErrorRequest = createErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'TIMEOUT',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.type).toEqual(ErrorType.ROUTE)
    })

    it('shall create ErrorRequest with ROUTE if errorCode is AUTHORIZATION_PROBLEM', () => {
      const actualErrorRequest = createErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'AUTHORIZATION_PROBLEM',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.type).toEqual(ErrorType.ROUTE)
    })

    it('shall create ErrorRequest with MODAL if errorCode is CONCURRENT_MODIFICATION', () => {
      const actualErrorRequest = createErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'CONCURRENT_MODIFICATION',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.type).toEqual(ErrorType.MODAL)
    })

    it('always create ErrorRequest with errorCode', () => {
      const actualErrorRequest = createErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.errorCode).toEqual(ErrorCode.UNEXPECTED_ERROR)
    })

    it('shall include api in message', () => {
      const actualErrorRequest = createErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.message).toContain('POST /api/call')
    })

    it('shall include message in message', () => {
      const actualErrorRequest = createErrorRequestFromApiError({
        api: 'POST /api/call',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'There was an error!',
      })
      expect(actualErrorRequest.message).toContain('There was an error!')
    })

    it('shall include certificateId', () => {
      const actualErrorRequest = createErrorRequestFromApiError(
        {
          api: 'POST /api/call',
          errorCode: 'UNEXPECTED_ERROR',
          message: 'There was an error!',
        },
        'certificateId'
      )
      expect(actualErrorRequest.certificateId).toEqual('certificateId')
    })
  })

  describe('createErrorRequestTimeout', () => {
    it('always create ErrorRequest with errorCode TIMEOUT', () => {
      const actualErrorRequest = createErrorRequestTimeout('There was an error!')
      expect(actualErrorRequest.errorCode).toEqual(ErrorCode.TIMEOUT)
    })

    it('always create ErrorRequest with type ROUTE', () => {
      const actualErrorRequest = createErrorRequestTimeout('There was an error!')
      expect(actualErrorRequest.type).toEqual(ErrorType.ROUTE)
    })

    it('always create ErrorRequest with passed in message', () => {
      const actualErrorRequest = createErrorRequestTimeout('There was an error!')
      expect(actualErrorRequest.message).toEqual('There was an error!')
    })
  })
})
