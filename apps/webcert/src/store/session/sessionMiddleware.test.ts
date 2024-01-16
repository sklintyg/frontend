/* eslint-disable no-console */
import { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import { throwError } from '../error/errorActions'
import { ErrorCode, ErrorType } from '../error/errorReducer'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import { getUserSuccess, setUnitSuccess, triggerLogoutNowStarted, triggerLogoutStarted } from '../user/userActions'
import {
  getSessionStatus,
  getSessionStatusError,
  getSessionStatusSuccess,
  setPollHandle,
  setSessionStatus,
  setSessionStatusPending,
  startPoll,
  stopPoll,
} from './sessionActions'
import { sessionMiddleware } from './sessionMiddleware'
import { Unit, User, SigningMethod } from '../../types'

function getDummyUnit(): Unit {
  return {
    address: 'adress',
    city: 'city',
    email: 'email',
    phoneNumber: 'phonenumber',
    unitId: 'unitid',
    unitName: 'unitname',
    zipCode: 'zipcode',
  } as Unit
}

function getDummyUser(): User {
  return {
    protectedPerson: false,
    hsaId: 'hsaid',
    loggedInCareProvider: getDummyUnit(),
    loggedInUnit: getDummyUnit(),
    name: 'name',
    preferences: null,
    role: 'role',
    signingMethod: SigningMethod.FAKE,
  } as User
}

function getDummyUserWithoutLoggedInUnit(): User {
  return {
    protectedPerson: false,
    hsaId: 'hsaid',
    loggedInCareProvider: {},
    loggedInUnit: {},
    name: 'name',
    preferences: null,
    role: 'role',
    signingMethod: SigningMethod.FAKE,
  } as User
}

describe('Test session middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, sessionMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle StartPolling', () => {
    it('shall start polling if not active', async () => {
      testStore.dispatch(startPoll())
      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeTruthy()
    })

    it('shall ignore start polling if already active', async () => {
      const activePollHandle = setInterval(() => console.log('active poll'), 30000)
      testStore.dispatch(setPollHandle(activePollHandle))

      testStore.dispatch(startPoll())

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toEqual(activePollHandle)
    })
  })

  describe('Handle StopPolling', () => {
    it('shall stop polling if active', async () => {
      const activePollHandle = setInterval(() => console.log('active poll'), 30000)
      testStore.dispatch(setPollHandle(activePollHandle))

      testStore.dispatch(stopPoll())

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeFalsy()
    })

    it('shall ignore stop polling if none active', async () => {
      testStore.dispatch(stopPoll())

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeFalsy()
    })
  })

  describe('Handle Get Session Status', () => {
    it('shall call api to get session status', async () => {
      testStore.dispatch(getSessionStatus())

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
      expect(fakeAxios.history.get[0].url).toBe('/api/session-auth-check/ping')
    })

    it('shall not call api again if a request is pending', async () => {
      testStore.dispatch(setSessionStatusPending(true))

      testStore.dispatch(getSessionStatus())

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(0)
    })
  })

  describe('Handle Get Session Status Success', () => {
    beforeEach(() => {
      testStore.dispatch(setSessionStatusPending(true))
    })

    it('shall store session status', async () => {
      const sessionStatus = { authenticated: true, hasSession: true, secondsUntilExpire: 999 }
      testStore.dispatch(getSessionStatusSuccess(sessionStatus))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.sessionStatus).toEqual(sessionStatus)
    })

    it('shall update session status pending to false', async () => {
      const sessionStatus = { authenticated: true, hasSession: true, secondsUntilExpire: 999 }
      testStore.dispatch(getSessionStatusSuccess(sessionStatus))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pending).toEqual(false)
    })

    it('shall throw error if not authenticated', async () => {
      const sessionStatus = { authenticated: false, hasSession: true, secondsUntilExpire: 999 }
      testStore.dispatch(getSessionStatusSuccess(sessionStatus))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction).toBeTruthy()
    })

    it('shall throw error with type ROUTE if not authenticated', async () => {
      const sessionStatus = { authenticated: false, hasSession: true, secondsUntilExpire: 999 }
      testStore.dispatch(getSessionStatusSuccess(sessionStatus))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw error with errorCode timeout if not authenticated', async () => {
      const sessionStatus = { authenticated: false, hasSession: true, secondsUntilExpire: 999 }
      testStore.dispatch(getSessionStatusSuccess(sessionStatus))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.TIMEOUT)
    })

    it('shall stop polling if not authenticated', async () => {
      testStore.dispatch(startPoll())

      const sessionStatus = { authenticated: false, hasSession: true, secondsUntilExpire: 999 }
      testStore.dispatch(getSessionStatusSuccess(sessionStatus))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeFalsy()
    })
  })

  describe('Handle Get Session Status Error', () => {
    const expectedError = {
      error: {
        api: 'POST /api/call',
        errorCode: 'AUTHORIZATION_PROBLEM',
        message: 'This is the message',
      },
    }

    beforeEach(() => {
      testStore.dispatch(setSessionStatus({ authenticated: true, hasSession: true, secondsUntilExpire: 9999 }))
      testStore.dispatch(setSessionStatusPending(true))
    })

    it('shall reset session status', async () => {
      const sessionStatus = { authenticated: false, hasSession: false, secondsUntilExpire: 0 }
      testStore.dispatch(getSessionStatusError(expectedError))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.sessionStatus).toEqual(sessionStatus)
    })

    it('shall update session status pending to false', async () => {
      testStore.dispatch(getSessionStatusError(expectedError))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pending).toEqual(false)
    })

    it('shall throw error if session status returns error', async () => {
      testStore.dispatch(getSessionStatusError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction).toBeTruthy()
    })

    it('shall throw error with type ROUTE if session status returns error', async () => {
      testStore.dispatch(getSessionStatusError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.type).toEqual(ErrorType.ROUTE)
    })

    it('shall throw error with errorCode if session status returns error', async () => {
      testStore.dispatch(getSessionStatusError(expectedError))

      await flushPromises()
      const throwErrorAction = dispatchedActions.find((action) => throwError.match(action))
      expect(throwErrorAction?.payload.errorCode).toEqual(ErrorCode.AUTHORIZATION_PROBLEM)
    })

    it('shall stop polling if session status returns error', async () => {
      testStore.dispatch(startPoll())

      testStore.dispatch(getSessionStatusError(expectedError))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeFalsy()
    })
  })

  describe('Handle Login', () => {
    it('shall start polling when logging in', async () => {
      testStore.dispatch(getUserSuccess({ user: getDummyUser(), links: [] }))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeTruthy()
    })

    it('shall not start polling when unit it not set', async () => {
      testStore.dispatch(getUserSuccess({ user: getDummyUserWithoutLoggedInUnit(), links: [] }))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeFalsy()
    })

    it('shall start polling when user has logged in and chosen a unit', async () => {
      testStore.dispatch(setUnitSuccess(getDummyUnit()))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeTruthy()
    })
  })

  describe('Handle Logout', () => {
    it('shall stop polling when logout is started', async () => {
      const activePollHandle = setInterval(() => console.log('active poll'), 30000)
      testStore.dispatch(setPollHandle(activePollHandle))

      testStore.dispatch(triggerLogoutStarted())

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeFalsy()
    })

    it('shall stop polling when logout NOW is started', async () => {
      const activePollHandle = setInterval(() => console.log('active poll'), 30000)
      testStore.dispatch(setPollHandle(activePollHandle))

      testStore.dispatch(triggerLogoutNowStarted())

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pollHandle).toBeFalsy()
    })
  })
})
