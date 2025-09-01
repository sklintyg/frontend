import type { AnyAction, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { flushPromises } from '../../utils/flushPromises'
import { configureApplicationStore } from '../configureApplicationStore'
import { throwError } from '../error/errorActions'
import { ErrorType } from '../error/errorReducer'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import type { ApiCall } from './apiActions'
import { apiCallBegan, apiGenericError, apiSilentGenericError } from './apiActions'
import { apiMiddleware } from './apiMiddleware'
import { isFunctionDisabled, selectAllRequests } from './requestSlice'

describe('Test API middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([apiMiddleware, dispatchHelperMiddleware])
  })

  describe('Handle API calls that leads to errors', () => {
    beforeEach(() => {
      fakeAxios.reset()
      clearDispatchedActions()
    })

    it('shall include errorCode when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').reply(500, { errorCode: 'ERROR_CODE', message: 'MESSAGE' })

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.errorCode).toEqual('ERROR_CODE')
    })

    it('shall include message when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').reply(500, { errorCode: 'ERROR_CODE', message: 'MESSAGE' })

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.message).toEqual('MESSAGE')
    })

    it('shall include api when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').reply(500, { errorCode: 'ERROR_CODE', message: 'MESSAGE' })

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.api).toEqual('POST /api/call')
    })

    it('shall use errorCode TIMEOUT if 403 when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').reply(403)

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.errorCode).toEqual('TIMEOUT')
    })

    it('shall include api if 403 when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').reply(403)

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.api).toEqual('POST /api/call')
    })

    it('shall include message if 403 when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').reply(403)

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.message).toEqual('403 - undefined') // No good way to mock statusText, so assert it as undefined
    })

    it('shall use errorCode UNKNOWN_INTERNAL_PROBLEM if no response when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').networkError()

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.errorCode).toEqual('UNKNOWN_INTERNAL_PROBLEM')
    })

    it('shall include api if no response when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').networkError()

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.api).toEqual('POST /api/call')
    })

    it('shall include message if no response when dispatching onError', async () => {
      fakeAxios.onPost('/api/call').networkError()

      testStore.dispatch(apiCallBegan({ url: '/api/call', method: 'POST', onError: 'ON_ERROR' }))

      await flushPromises()
      const onErrorAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === 'ON_ERROR')
      expect(onErrorAction?.payload.error.message).toEqual('Network Error')
    })
  })

  describe('Handle apiGenericError', () => {
    beforeEach(() => {
      clearDispatchedActions()
    })

    it('shall dispatch throwError with ErrorRequest', async () => {
      testStore.dispatch(
        apiGenericError({ error: { api: 'POST /api/call', errorCode: 'UNKNOWN_INTERNAL_ERROR', message: 'Error message' } })
      )

      await flushPromises()
      const throwErrorAction: AnyAction | undefined = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction).toBeTruthy()
    })
  })

  describe('Handle apiSilentGenericError', () => {
    beforeEach(() => {
      clearDispatchedActions()
    })

    it('shall dispatch throwError with ErrorRequest with ErrorType SILENT', async () => {
      testStore.dispatch(
        apiSilentGenericError({ error: { api: 'POST /api/call', errorCode: 'UNKNOWN_INTERNAL_ERROR', message: 'Error message' } })
      )

      await flushPromises()
      const throwErrorAction: AnyAction | undefined = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.SILENT)
    })
  })

  it('should handle functionDisabler', async () => {
    const FUNCTION_DISABLER_TYPE = 'FUNCTION_DISABLER_TYPE'
    const URL = 'URL'

    fakeAxios.onGet(URL).reply(200)

    const call: ApiCall = { url: URL, method: 'GET', functionDisablerType: FUNCTION_DISABLER_TYPE }

    testStore.dispatch(apiCallBegan(call))

    expect(selectAllRequests(testStore.getState())).toMatchObject([call])

    expect(isFunctionDisabled(FUNCTION_DISABLER_TYPE)(testStore.getState())).toBe(true)

    await flushPromises()

    expect(selectAllRequests(testStore.getState())).toMatchObject([])

    expect(isFunctionDisabled(FUNCTION_DISABLER_TYPE)(testStore.getState())).toBe(false)
  })

  describe('handle API calls with launchId', () => {
    const INVALID_LAUNCHID = 'INVALID_LAUNCHID'
    const user = {
      launchId: '97f279ba-7d2b-4b0a-8665-7adde08f26f4',
    }
    beforeEach(() => {
      clearDispatchedActions()
      sessionStorage.clear()
    })

    it('should add launchId to header if its present in sessionStorage', async () => {
      sessionStorage.setItem('launchId', user.launchId)

      fakeAxios.onGet('api/call').reply((config) => {
        expect(config.headers?.launchId).toEqual(user.launchId)
        return [200]
      })
    })

    it('should not add launchId to header if its not present in sessionStorage', async () => {
      fakeAxios.onGet('api/call').reply((config) => {
        expect(config.headers?.launchId).toEqual(null)
        return [200]
      })
    })

    it('should throw INVALID_LAUNCHID type error', async () => {
      const response = {
        errorCode: 'INVALID_LAUNCHID',
        message: 'Invalid launchId',
      }

      fakeAxios.onGet('api/call').reply(403, response)
      testStore.dispatch(apiCallBegan({ url: 'api/call', method: 'GET' }))

      await flushPromises()

      const throwErrorAction: AnyAction[] | undefined = dispatchedActions.filter((action) => action.type === INVALID_LAUNCHID)

      expect(throwErrorAction).toBeTruthy()
    })
    it('should not throw INVALID_LAUNCHID type error', async () => {
      fakeAxios.onGet('api/call').reply(403)
      testStore.dispatch(apiCallBegan({ url: 'api/call', method: 'GET' }))

      await flushPromises()

      const throwErrorAction: AnyAction[] | undefined = dispatchedActions.filter((action) => action.type === INVALID_LAUNCHID)
      expect(throwErrorAction.length).toBe(0)
    })
  })
})
