import type { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { fakeCertificateListItem } from '../../faker/certificate/fakeCertificateListItem'
import { fakeListConfig } from '../../faker/list/fakeListConfig'
import { fakeListFilter } from '../../faker/list/fakeListFilter'
import { fakeTextFilter } from '../../faker/list/fakeListFilterConfig'
import type { CertificateListItem} from '../../types';
import { ListType } from '../../types'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import type {
  ListResponse} from './listActions';
import {
  getCertificateList,
  getCertificateListConfig,
  getDraftListConfig,
  getDrafts,
  getPreviousCertificatesList,
  getPreviousCertificatesListConfig,
  getUnhandledCertificates,
  getUnhandledCertificatesListConfig,
  resetListState,
  updateActiveListConfig,
  updateActiveListType,
  updateListConfig,
} from './listActions'
import { listMiddleware } from './listMiddleware'

describe('Test list middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, listMiddleware])

    testStore.dispatch(
      updateActiveListConfig(
        fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              placeholder: 'test',
              description: 'description',
            }),
          ],
        })
      )
    )
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle get lists', () => {
    describe('drafts', () => {
      it('shall call api to get drafts', async () => {
        const filter = fakeListFilter()
        testStore.dispatch(getDrafts(filter))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/draft')
      })

      it('shall save list', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = [fakeCertificateListItem()]
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/draft').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.DRAFTS))
        testStore.dispatch(getDrafts(fakeListFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
      })

      it('shall save total count', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = []
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/draft').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.DRAFTS))
        testStore.dispatch(getDrafts(fakeListFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
      })
    })

    describe('certificates', () => {
      it('shall call api to get certificates', async () => {
        const filter = fakeListFilter()
        testStore.dispatch(getCertificateList(filter))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/certificate')
      })

      it('shall save list', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = [fakeCertificateListItem()]
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/certificate').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.CERTIFICATES))
        testStore.dispatch(getCertificateList(fakeListFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
      })

      it('shall save total count', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = []
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/certificate').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.CERTIFICATES))
        testStore.dispatch(getCertificateList(fakeListFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
      })
    })

    describe('previous certificates', () => {
      it('shall call api to get previous certificates', async () => {
        const filter = fakeListFilter()
        testStore.dispatch(getPreviousCertificatesList(filter))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/previous')
      })

      it('shall save list', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = [fakeCertificateListItem()]
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/previous').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.PREVIOUS_CERTIFICATES))
        testStore.dispatch(getPreviousCertificatesList(fakeListFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
      })

      it('shall save total count', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = []
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/previous').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.PREVIOUS_CERTIFICATES))
        testStore.dispatch(getPreviousCertificatesList(fakeListFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.totalCount).toEqual(expectedTotalCount)
      })
    })

    describe('questions', () => {
      it('shall call api to get questions', async () => {
        const filter = fakeListFilter()
        testStore.dispatch(getUnhandledCertificates(filter))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/question')
      })

      it('shall save list', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = [fakeCertificateListItem()]
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/question').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.UNHANDLED_CERTIFICATES))
        testStore.dispatch(getUnhandledCertificates(fakeListFilter()))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeList).toEqual(expectedList)
      })

      it('shall save total count', async () => {
        const expectedTotalCount = 10
        const expectedList: CertificateListItem[] = []
        const getListSuccess = { list: expectedList, totalCount: expectedTotalCount } as ListResponse
        fakeAxios.onPost('/api/list/question').reply(200, getListSuccess)

        testStore.dispatch(updateActiveListType(ListType.UNHANDLED_CERTIFICATES))
        testStore.dispatch(getUnhandledCertificates(fakeListFilter()))

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
        const expectedConfig = fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              description: 'description',
            }),
          ],
        })

        fakeAxios.onGet('/api/list/config/draft').reply(200, expectedConfig)

        testStore.dispatch(getDraftListConfig())

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
      })

      it('shall set list type to filter', async () => {
        const expectedConfig = fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              placeholder: 'test',
              description: 'description',
            }),
          ],
        })

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
        const expectedConfig = fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              placeholder: 'test',
              description: 'description',
            }),
          ],
        })

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
        const expectedConfig = fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              placeholder: 'test',
              description: 'description',
            }),
          ],
        })

        fakeAxios.onGet('/api/list/config/previous').reply(200, expectedConfig)

        testStore.dispatch(getPreviousCertificatesListConfig())

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
      })
    })

    describe('unhandled certificates', () => {
      it('shall call api to get config', async () => {
        testStore.dispatch(getUnhandledCertificatesListConfig('UNIT_ID'))

        await flushPromises()
        expect(fakeAxios.history.post.length).toBe(1)
        expect(fakeAxios.history.post[0].url).toEqual('/api/list/config/question')
      })

      it('shall save config', async () => {
        const expectedConfig = fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              placeholder: 'test',
              description: 'description',
            }),
          ],
        })

        fakeAxios.onGet('/api/list/config/question').reply(200, expectedConfig)

        testStore.dispatch(getUnhandledCertificatesListConfig('UNIT_ID'))

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
      })

      it('shall save updated config if type is unhandled certificates', async () => {
        const expectedConfig = fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              placeholder: 'test',
              description: 'description',
            }),
          ],
        })
        testStore.dispatch(resetListState())
        testStore.dispatch(updateActiveListType(ListType.UNHANDLED_CERTIFICATES))
        fakeAxios.onPost('/api/list/config/question/update').reply(200, expectedConfig)

        testStore.dispatch(updateListConfig())

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListConfig).toEqual(expectedConfig)
      })

      it('shall not save updated config if type is not unhandled certificates', async () => {
        const expectedConfig = fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              placeholder: 'test',
              description: 'description',
            }),
          ],
        })
        testStore.dispatch(resetListState())
        testStore.dispatch(updateActiveListType(ListType.DRAFTS))
        fakeAxios.onPost('/api/list/config/question/update').reply(200, expectedConfig)

        testStore.dispatch(updateListConfig())

        await flushPromises()
        expect(testStore.getState().ui.uiList.activeListConfig).not.toEqual(expectedConfig)
      })
    })
  })
})
