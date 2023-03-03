import { AnyAction, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { FunctionDisabler } from '../../utils/functionDisablerUtils'
import { configureApplicationStore } from '../configureApplicationStore'
import { throwError } from '../error/errorActions'
import { ErrorType } from '../error/errorReducer'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import { apiCallBegan, apiGenericError, apiSilentGenericError } from './apiActions'
import apiMiddleware from './apiMiddleware'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

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

  describe('handle functionDisabler', () => {
    const FUNCTION_DISABLER_TYPE = 'FUNCTION_DISABLER_TYPE'
    const URL = 'URL'

    beforeEach(() => {
      clearDispatchedActions()
    })

    it('shall dispatch functionDisablerType', async () => {
      fakeAxios.onGet(URL).reply(200)

      testStore.dispatch(apiCallBegan({ url: URL, method: 'GET', functionDisablerType: FUNCTION_DISABLER_TYPE }))
      await flushPromises()
      const functionDisablerAction: AnyAction | undefined = dispatchedActions.find((action) => action.type === FUNCTION_DISABLER_TYPE)

      expect(functionDisablerAction).toBeTruthy()
    })

    it('shall dispatch functionDisablerType and then dispatch the same functionDisabler after successful api call', async () => {
      fakeAxios.onGet(URL).reply(200)

      testStore.dispatch(apiCallBegan({ url: URL, method: 'GET', functionDisablerType: FUNCTION_DISABLER_TYPE }))
      await flushPromises()
      const functionDisablerActions: AnyAction[] | undefined = dispatchedActions.filter((action) => action.type === FUNCTION_DISABLER_TYPE)
      const initialFunctionDisabler = functionDisablerActions[0]?.payload as FunctionDisabler
      const finalFunctionDisabler = functionDisablerActions[1]?.payload as FunctionDisabler

      expect(initialFunctionDisabler.id).toBe(finalFunctionDisabler.id)
    })

    it('shall dispatch functionDisablerType and then dispatch the same functionDisabler after failed api call', async () => {
      fakeAxios.onGet(URL).reply(500)

      testStore.dispatch(apiCallBegan({ url: URL, method: 'GET', functionDisablerType: FUNCTION_DISABLER_TYPE }))
      await flushPromises()
      const functionDisablerActions: AnyAction[] | undefined = dispatchedActions.filter((action) => action.type === FUNCTION_DISABLER_TYPE)
      const addFunctionDisabler = functionDisablerActions[0]?.payload as FunctionDisabler
      const removeFunctionDisabler = functionDisablerActions[1]?.payload as FunctionDisabler

      expect(addFunctionDisabler.id).toBe(removeFunctionDisabler.id)
    })
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
        expect(config.headers.launchId).toEqual(user.launchId)
        return [200]
      })
    })

    it('should not add launchId to header if its not present in sessionStorage', async () => {
      fakeAxios.onGet('api/call').reply((config) => {
        expect(config.headers.launchId).toEqual(null)
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
