import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { userMiddleware } from './userMiddleware'
import { getUserStatistics, setUnit, triggerLogout, updateInactivateAutomaticLogout } from './userActions'
import { getUser } from '@frontend/common'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test user middleware', () => {
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

  describe('GetUserStatistics', () => {
    it('shall make api call', async () => {
      testStore.dispatch(getUserStatistics)

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
      expect(fakeAxios.history.get[0].url).toEqual('/api/user/statistics')
    })

    it('shall set number of drafts on unit if success', async () => {
      const statistics = {
        nbrOfDraftsOnSelectedUnit: 10,
      }

      fakeAxios.onGet('/api/user/statistics').reply(200, statistics)

      testStore.dispatch(getUserStatistics)

      await flushPromises()
      expect(testStore.getState().ui.uiUser.userStatistics.nbrOfDraftsOnSelectedUnit).toEqual(10)
    })
  })

  describe('Handle set unit', () => {
    it('should call api to set unit', async () => {
      testStore.dispatch(setUnit('unitId'))

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
    })

    it('should set care unit on success', async () => {
      fakeAxios.onPost('/api/user/unit/1234a').reply(200, { user: getUser() })
      testStore.dispatch(setUnit('1234a'))

      await flushPromises()
      expect(testStore.getState().ui.uiUser.user.loggedInUnit.unitId).toEqual('1234a')
    })
  })
})
