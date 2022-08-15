import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import { apiMiddleware } from '../api/apiMiddleware'
import { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { userMiddleware } from './userMiddleware'
import {
  acknowledgeSubscription,
  getUserStatistics,
  setUnit,
  triggerLogout,
  updateInactivateAutomaticLogout,
  updateIsCareProviderModalOpen,
  updateUserResourceLinks,
} from './userActions'
import {
  getSubscriptionWarningResourceLink,
  getUser,
  getUserStatistics as statistics,
  ResourceLink,
  ResourceLinkType,
} from '@frontend/common'
import { stopPoll } from '../session/sessionActions'

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

  it('should close care provider modal when user is logged ut because of inactivity', () => {
    testStore.dispatch(updateIsCareProviderModalOpen(true))
    testStore.dispatch(stopPoll())

    expect(testStore.getState().ui.uiUser.isCareProviderModalOpen).toBeFalsy()
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

    it('shall set number of drafts on selected unit if success', async () => {
      fakeAxios.onGet('/api/user/statistics').reply(200, statistics())

      testStore.dispatch(getUserStatistics)

      await flushPromises()
      expect(testStore.getState().ui.uiUser.userStatistics.nbrOfDraftsOnSelectedUnit).toEqual(6)
    })

    it('should set number of drafts and unhandled questions on other units if success', async () => {
      fakeAxios.onGet('/api/user/statistics').reply(200, statistics())

      testStore.dispatch(getUserStatistics)

      await flushPromises()
      expect(testStore.getState().ui.uiUser.userStatistics.totalDraftsAndUnhandledQuestionsOnOtherUnits).toEqual(17)
    })

    it('should set number of drafts on unit if success', async () => {
      fakeAxios.onGet('/api/user/statistics').reply(200, statistics())

      testStore.dispatch(getUserStatistics)

      await flushPromises()
      expect(testStore.getState().ui.uiUser.userStatistics.unitStatistics['1234a'].draftsOnUnit).toEqual(3)
    })
  })

  describe('Handle set unit', () => {
    it('should call api to set unit', async () => {
      testStore.dispatch(setUnit('1234a'))

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/user/unit/1234a')
    })

    it('should set care unit on success', async () => {
      fakeAxios.onPost('/api/user/unit/1234a').reply(200, { user: getUser() })
      testStore.dispatch(setUnit('1234a'))

      await flushPromises()
      expect(testStore.getState().ui.uiUser.user.loggedInUnit.unitId).toEqual('1234a')
    })
  })

  describe('Handle subscription', () => {
    it('should call api to acknowledge subscription', async () => {
      testStore.dispatch(acknowledgeSubscription())

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
    })

    it('should remove SUBSCRIPTION_WARNING resource link on success', async () => {
      testStore.dispatch(updateUserResourceLinks(getSubscriptionWarningResourceLink()))
      fakeAxios.onGet('/api/subscription/acknowledgeSubscriptionModal').reply(200)
      testStore.dispatch(acknowledgeSubscription())

      await flushPromises()

      const resourceLink = testStore.getState().ui.uiUser.links.map((link: ResourceLink) => link.type)

      expect(resourceLink).not.toContain(ResourceLinkType.SUBSCRIPTION_WARNING)
    })
  })
})
