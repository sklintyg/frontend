import { CertificateListItem, ListType } from '@frontend/common/src/types/list'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { getConfigWithTextFilter, getDefaultList, getFilter } from '../../feature/list/test/listTestUtils'
import { apiMiddleware } from '../api/apiMiddleware'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import {
  getCertificateList,
  getCertificateListConfig,
  getDraftListConfig,
  getDrafts,
  getPreviousCertificatesList,
  getPreviousCertificatesListConfig,
  getUnhandledCertificatesListConfig,
  getUnhandledCertificates,
  ListResponse,
  updateActiveListConfig,
  updateActiveListType,
} from './listActions'
import { listMiddleware } from './listMiddleware'

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

    testStore.dispatch(updateActiveListConfig(getConfigWithTextFilter()))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle get lists', () => {
    describe('drafts', () => {
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

        testStore.dispatch(updateActiveListType(ListType.DRAFTS))
        testStore.dispatch(getDrafts(getFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
      })

      it('shall save total count', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = []
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/draft').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.DRAFTS))
        testStore.dispatch(getDrafts(getFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
      })
    })

    describe('certificates', () => {
      it('shall call api to get certificates', async () => {
        const filter = getFilter()
        testStore.dispatch(getCertificateList(filter))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/certificate')
      })

      it('shall save list', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = getDefaultList()
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/certificate').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.CERTIFICATES))
        testStore.dispatch(getCertificateList(getFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
      })

      it('shall save total count', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = []
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/certificate').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.CERTIFICATES))
        testStore.dispatch(getCertificateList(getFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
      })
    })

    describe('previous certificates', () => {
      it('shall call api to get previous certificates', async () => {
        const filter = getFilter()
        testStore.dispatch(getPreviousCertificatesList(filter))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/previous')
      })

      it('shall save list', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = getDefaultList()
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/previous').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.PREVIOUS_CERTIFICATES))
        testStore.dispatch(getPreviousCertificatesList(getFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
      })

      it('shall save total count', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = []
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/previous').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.PREVIOUS_CERTIFICATES))
        testStore.dispatch(getPreviousCertificatesList(getFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
      })
    })

    describe('questions', () => {
      it('shall call api to get questions', async () => {
        const filter = getFilter()
        testStore.dispatch(getUnhandledCertificates(filter))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/question')
      })

      it('shall save list', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = getDefaultList()
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/question').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.UNHANDLED_CERTIFICATES))
        testStore.dispatch(getUnhandledCertificates(getFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
      })

      it('shall save total count', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = []
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/question').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.UNHANDLED_CERTIFICATES))
        testStore.dispatch(getUnhandledCertificates(getFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
      })
    })
  })

  describe('Handle get list config', () => {
    describe('draft', () => {
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

      it('shall set list type to filter', async () => {
        const expectedConfig = getConfigWithTextFilter()

        fakeAxios.onGet('/api/list/config/draft').reply(200, expectedConfig)

        testStore.dispatch(updateActiveListType(ListType.DRAFTS))
        testStore.dispatch(getDraftListConfig())

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListFilter.type).toEqual(ListType.DRAFTS)
      })
    })

    describe('certificates', () => {
      it('shall call api to get config', async () => {
        testStore.dispatch(getCertificateListConfig())

        await flushPromises()
        expect(fakeAxios.history.get.length).toBe(1)
        expect(fakeAxios.history.get[0].url).toEqual('/api/list/config/certificate')
      })

      it('shall save config', async () => {
        const expectedConfig = getConfigWithTextFilter()

        fakeAxios.onGet('/api/list/config/draft').reply(200, expectedConfig)

        testStore.dispatch(getDraftListConfig())

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
      })
    })

    describe('previous certificates', () => {
      it('shall call api to get config', async () => {
        testStore.dispatch(getPreviousCertificatesListConfig())

        await flushPromises()
        expect(fakeAxios.history.get.length).toBe(1)
        expect(fakeAxios.history.get[0].url).toEqual('/api/list/config/previous')
      })

      it('shall save config', async () => {
        const expectedConfig = getConfigWithTextFilter()

        fakeAxios.onGet('/api/list/config/previous').reply(200, expectedConfig)

        testStore.dispatch(getPreviousCertificatesListConfig())

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
      })
    })

    describe('questions', () => {
      it('shall call api to get config', async () => {
        testStore.dispatch(getUnhandledCertificatesListConfig('UNIT_ID'))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/config/question')
      })

      it('shall save config', async () => {
        const expectedConfig = getConfigWithTextFilter()

        fakeAxios.onGet('/api/list/config/question').reply(200, expectedConfig)

        testStore.dispatch(getUnhandledCertificatesListConfig('UNIT_ID'))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
      })
    })
  })
})
