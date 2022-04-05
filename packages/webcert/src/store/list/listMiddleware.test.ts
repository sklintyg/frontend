import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import apiMiddleware from '../api/apiMiddleware'
import { listMiddleware } from './listMiddleware'
import { getDraftListConfig, getDrafts, ListResponse } from './listActions'
import { CertificateListItem, ListConfig, ListType } from '@frontend/common/src/types/list'
import { getFilter, getTextFilter } from '../../feature/list/test/listTestUtils'

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
      const expectedList: CertificateListItem[] = [
        {
          id: 'example',
        },
      ]
      const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
      fakeAxios.onPost('/api/list/draft').reply(200, getListSuccess)

      testStore.dispatch(getDrafts(getFilter()))

      await flushPromises()
      expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
    })

    it('shall save total count', async () => {
      const expectedTotalCount = 10
      const expectedList: CertificateListItem[] = [{}]
      const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
      fakeAxios.onPost('/api/list/draft').reply(200, getListSuccess)

      testStore.dispatch(getDrafts(getFilter()))

      await flushPromises()
      expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
    })

    it('shall set list type', async () => {
      const expectedTotalCount = 10
      const expectedList: CertificateListItem[] = [{}]
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
      const expectedConfig: ListConfig = {
        title: 'title',
        filters: [getTextFilter()],
        openCertificateTooltip: 'tooltip',
        searchCertificateTooltip: 'tooltip',
        tableHeadings: [
          {
            id: 'id',
            title: 'title',
          },
        ],
        defaultOrderBy: 'orderBy',
      }

      fakeAxios.onGet('/api/list/config/draft').reply(200, expectedConfig)

      testStore.dispatch(getDraftListConfig())

      await flushPromises()
      expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
    })
  })
})
