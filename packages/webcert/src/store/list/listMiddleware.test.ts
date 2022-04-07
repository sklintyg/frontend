import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import apiMiddleware from '../api/apiMiddleware'
import { listMiddleware } from './listMiddleware'
import { getDraftListConfig, getDrafts, ListResponse, performListSearch, updateActiveListFilter, updateActiveListType } from './listActions'
import { CertificateListItem, ListType } from '@frontend/common/src/types/list'
import { getConfigWithTextFilter, getDefaultList, getFilter, getFilterWithValues } from '../../feature/list/test/listTestUtils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test list middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, listMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle get drafts', () => {
    it('shall call api to get drafts', async () => {
      const filter = getFilter()
      testStore.dispatch(getDrafts(filter))

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].url).toEqual('/api/list/draft')
    })

    it('shall save list', async () => {
      const expectedTotalCount = 10
      const expectedList: CertificateListItem[] = getDefaultList()
      const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
      fakeAxios.onPost('/api/list/draft').reply(200, getListSuccess)

      testStore.dispatch(getDrafts(getFilter()))

      await flushPromises()
      expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
    })

    it('shall save total count', async () => {
      const expectedTotalCount = 10
      const expectedList: CertificateListItem[] = []
      const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
      fakeAxios.onPost('/api/list/draft').reply(200, getListSuccess)

      testStore.dispatch(getDrafts(getFilter()))

      await flushPromises()
      expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
    })

    it('shall set list type', async () => {
      const expectedTotalCount = 10
      const expectedList: CertificateListItem[] = []
      const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
      fakeAxios.onPost('/api/list/draft').reply(200, getListSuccess)

      testStore.dispatch(getDrafts(getFilter()))

      await flushPromises()
      expect(testStore.getState().ui.uiList.activeListType).toEqual(ListType.DRAFTS)
    })
  })

  describe('Handle get draft list config', () => {
    it('shall call api to get config', async () => {
      testStore.dispatch(getDraftListConfig())

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
      expect(fakeAxios.history.get[0].url).toEqual('/api/list/config/draft')
    })

    it('shall save config', async () => {
      const expectedConfig = getConfigWithTextFilter()

      fakeAxios.onGet('/api/list/config/draft').reply(200, expectedConfig)

      testStore.dispatch(getDraftListConfig())

      await flushPromises()
      expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
    })

    it('shall set list type', async () => {
      const expectedConfig = getConfigWithTextFilter()

      fakeAxios.onGet('/api/list/config/draft').reply(200, expectedConfig)

      testStore.dispatch(getDraftListConfig())

      await flushPromises()
      expect(testStore.getState().ui.uiList.activeListType).toEqual(ListType.DRAFTS)
    })
  })

  describe('Handle perform list search', () => {
    it('shall get drafts if correct list type', async () => {
      testStore.dispatch(updateActiveListFilter(getFilterWithValues()))
      testStore.dispatch(updateActiveListType(ListType.DRAFTS))

      testStore.dispatch(performListSearch)

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
      expect(fakeAxios.history.get[0].url).toEqual('/api/list/draft')
    })
  })
})
