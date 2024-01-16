import { getSubscriptionWarningResourceLink, getUser, getUserWithLaunchId, getUserStatistics as statistics } from '@frontend/common'
import { ResourceLink, ResourceLinkType } from '@frontend/common/types'
import { AnyAction, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import { stopPoll } from '../session/sessionActions'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import {
  acknowledgeSubscription,
  getUserStatistics,
  getUserSuccess,
  setUnit,
  triggerLogout,
  updateInactivateAutomaticLogout,
  updateIsCareProviderModalOpen,
  updateUserResourceLinks,
} from './userActions'
import { userMiddleware } from './userMiddleware'

describe('Test user middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([apiMiddleware, userMiddleware, dispatchHelperMiddleware])
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

  describe('Handle GetUserSuccess actions', () => {
    beforeEach(() => {
      sessionStorage.clear()
    })
    it('should add launchId to sessionStorage if added on user', async () => {
      const data = {
        user: getUserWithLaunchId(),
        links: [],
      }
      testStore.dispatch(getUserSuccess(data))

      await flushPromises()

      expect(sessionStorage.getItem('launchId')).toBe(data.user.launchId)
    })
    it('should not add launchId to sessionStorage if not added on user', async () => {
      const data = {
        user: getUser(),
        links: [],
      }
      testStore.dispatch(getUserSuccess(data))

      await flushPromises()

      expect(sessionStorage.getItem('launchId')).toBe(null)
    })
    it('should dispatch updateUser action', async () => {
      const data = {
        user: getUser(),
        links: [],
      }
      testStore.dispatch(getUserSuccess(data))

      await flushPromises()

      const didUpdateUser: AnyAction | undefined = dispatchedActions.find((action) => action.type === '[User] Update user')

      expect(didUpdateUser).toBeTruthy()
    })
    it('should update the user with correct values', async () => {
      const data = {
        user: getUser(),
        links: [],
      }
      testStore.dispatch(getUserSuccess(data))

      await flushPromises()

      const { user } = testStore.getState().ui.uiUser
      expect(user).toBe(data.user)
    })
    it('should dispatch updateUserResources action', async () => {
      const data = {
        user: getUser(),
        links: [],
      }
      testStore.dispatch(getUserSuccess(data))

      await flushPromises()

      const didUpdateResourceLinks: AnyAction | undefined = dispatchedActions.find(
        (action) => action.type === '[User] Update user resource links'
      )

      expect(didUpdateResourceLinks).toBeTruthy()
    })
    it('should update the user resourceLinks with correct values', async () => {
      const data = {
        user: getUser(),
        links: [],
      }
      testStore.dispatch(getUserSuccess(data))

      await flushPromises()

      const resourceLink = testStore.getState().ui.uiUser.links

      expect(resourceLink).toBe(data.links)
    })
    it('should dispatch isLoadingUser action', async () => {
      const data = {
        user: getUser(),
        links: [],
      }
      testStore.dispatch(getUserSuccess(data))

      await flushPromises()

      const didUpdateIsLoadingUser: AnyAction | undefined = dispatchedActions.find(
        (action) => action.type === '[User] Update is loading user'
      )

      expect(didUpdateIsLoadingUser).toBeTruthy()
    })
    it('should update isLoadingUser to false', async () => {
      const data = {
        user: getUser(),
        links: [],
      }
      testStore.dispatch(getUserSuccess(data))

      await flushPromises()

      const { isLoadingUser } = testStore.getState().ui.uiUser

      expect(isLoadingUser).toBeFalsy()
    })
  })
})
