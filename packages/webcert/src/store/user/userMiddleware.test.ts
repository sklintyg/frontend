import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { userMiddleware } from './userMiddleware'
import { triggerLogout, updateInactivateAutomaticLogout } from './userActions'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test certificate middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiMiddleware, userMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle TriggerLogout', () => {
    it('shall send logout request if inactivateAutomaticLogout is false', async () => {
      testStore.dispatch(triggerLogout)

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
    })

    it('shall not send logout request if inactivateAutomaticLogout is true', async () => {
      testStore.dispatch(updateInactivateAutomaticLogout(true))
      testStore.dispatch(triggerLogout)

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(0)
    })
  })
})
