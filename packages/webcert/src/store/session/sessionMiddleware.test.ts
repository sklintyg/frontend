import MockAdapter from 'axios-mock-adapter'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import apiMiddleware from '../api/apiMiddleware'
import { sessionMiddleware } from './sessionMiddleware'
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
import { getUserSuccess, triggerLogoutNowStarted, triggerLogoutStarted } from '../user/userActions'
import { SigningMethod, Unit, User } from '@frontend/common'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test session middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, sessionMiddleware),
    })
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

    it('shall set session to logged out is not authenticated - THIS IS TEMPORARY UNTIL ERROR-HANDLING IS IMPLEMENTED -', async () => {
      const sessionStatus = { authenticated: false, hasSession: true, secondsUntilExpire: 999 }
      testStore.dispatch(getSessionStatusSuccess(sessionStatus))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.loggedOut).toEqual(true)
    })
  })

  describe('Handle Get Session Status Error', () => {
    beforeEach(() => {
      testStore.dispatch(setSessionStatus({ authenticated: true, hasSession: true, secondsUntilExpire: 9999 }))
      testStore.dispatch(setSessionStatusPending(true))
    })

    it('shall reset session status', async () => {
      const sessionStatus = { authenticated: false, hasSession: false, secondsUntilExpire: 0 }
      testStore.dispatch(getSessionStatusError('Something went wrong!'))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.sessionStatus).toEqual(sessionStatus)
    })

    it('shall update session status pending to false', async () => {
      testStore.dispatch(getSessionStatusError('Something went wrong!'))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.pending).toEqual(false)
    })

    it('shall set session to logged out if error occurred - THIS IS TEMPORARY UNTIL ERROR-HANDLING IS IMPLEMENTED -', async () => {
      testStore.dispatch(getSessionStatusError('Something went wrong!'))

      await flushPromises()
      expect(testStore.getState().ui.uiSession.loggedOut).toEqual(true)
    })
  })

  describe('Handle Login', () => {
    it('shall start polling when logging in', async () => {
      testStore.dispatch(getUserSuccess(getDummyUser()))

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

function getDummyUser(): User {
  return {
    hsaId: 'hsaid',
    loggedInCareProvider: getDummyUnit(),
    loggedInUnit: getDummyUnit(),
    name: 'name',
    preferences: null,
    role: 'role',
    signingMethod: SigningMethod.FAKE,
  }
}

function getDummyUnit(): Unit {
  return {
    address: 'adress',
    city: 'city',
    email: 'email',
    phoneNumber: 'phonenumber',
    unitId: 'unitid',
    unitName: 'unitname',
    zipCode: 'zipcode',
  }
}
