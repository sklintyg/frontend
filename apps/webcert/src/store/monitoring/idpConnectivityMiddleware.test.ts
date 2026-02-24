/* eslint-disable max-classes-per-file */
import type { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { fakeUser } from '../../faker'
import type { ResourceLink, User } from '../../types'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import { getUserSuccess } from '../user/userActions'
import { updateConfig } from '../utils/utilsActions'
import type { Configuration } from '../utils/utilsReducer'
import { idpConnectivityMiddleware, resetIdpConnectivityCheck } from './idpConnectivityMiddleware'

const IDP_URL_1 = 'https://idp1.example.com'
const IDP_URL_2 = 'https://idp2.example.com'

function getConfigWithIdpUrls(urls: string[]): Configuration {
  return {
    version: '1.0',
    banners: [],
    cgiFunktionstjansterIdpUrl: '',
    sakerhetstjanstIdpUrl: '',
    ppHost: '',
    forwardDraftOrQuestionUrl: '',
    idpConnectUrls: urls,
  }
}

function getLoggedInUser(): User {
  return fakeUser()
}

function getUserWithoutLoggedInUnit(): User {
  return fakeUser({
    loggedInUnit: {} as Record<PropertyKey, never>,
  })
}

describe('Test idpConnectivity middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchSpy: any
  let imageInstances: Array<{ src: string; onload: (() => void) | null; onerror: (() => void) | null }>

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    fakeAxios.onPost('/api/jslog/monitoring').reply(200)
    fakeAxios.onPost('/api/log/error').reply(200)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, idpConnectivityMiddleware])
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('127.0.0.1'))
    resetIdpConnectivityCheck()
    globalThis.localStorage.removeItem('last-idp-connectivity-check-date')
    clearDispatchedActions()

    // Mock Image constructor to track instances and simulate load/error events
    imageInstances = []
    vi.stubGlobal(
      'Image',
      class MockImage {
        onload: (() => void) | null = null

        onerror: (() => void) | null = null

        private internalSrc = ''

        constructor() {
          imageInstances.push(this)
        }

        get src() {
          return this.internalSrc
        }

        set src(value: string) {
          this.internalSrc = value
          // Trigger onload asynchronously after src is set
          setTimeout(() => {
            if (this.onload) {
              this.onload()
            }
          }, 0)
        }
      }
    )
  })

  afterEach(() => {
    fetchSpy.mockRestore()
    vi.unstubAllGlobals()
    clearDispatchedActions()
  })

  describe('Handle getUserSuccess', () => {
    it('shall not perform connectivity check when user has no loggedInUnit', async () => {
      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getUserWithoutLoggedInUnit(), links: [] as ResourceLink[] }))

      await flushPromises()
      expect(fetchSpy).not.toHaveBeenCalled()
      expect(imageInstances.length).toBe(0)
    })

    it('shall not perform connectivity check when idpConnectUrls is empty', async () => {
      testStore.dispatch(updateConfig(getConfigWithIdpUrls([])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      expect(fetchSpy).not.toHaveBeenCalled()
      expect(imageInstances.length).toBe(0)
    })

    it('shall perform connectivity check when user is logged in and idpConnectUrls is configured', async () => {
      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      expect(fetchSpy).toHaveBeenCalledWith('https://api.ipify.org')
      expect(imageInstances.length).toBe(1)
      expect(imageInstances[0].src).toContain(IDP_URL_1)
      expect(imageInstances[0].src).toContain('/favicon.ico?')
    })

    it('shall check all configured idp urls', async () => {
      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1, IDP_URL_2])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      expect(imageInstances.length).toBe(2)
      expect(imageInstances[0].src).toContain(IDP_URL_1)
      expect(imageInstances[1].src).toContain(IDP_URL_2)
    })

    it('shall only perform connectivity check once when getUserSuccess is dispatched multiple times', async () => {
      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      expect(fetchSpy).toHaveBeenCalledTimes(1) // Only 1 ipify call
      expect(imageInstances.length).toBe(1) // Only 1 image check
    })
  })

  describe('Handle localStorage rate limiting', () => {
    it('shall not perform connectivity check if checked within 24 hours', async () => {
      globalThis.localStorage.setItem('last-idp-connectivity-check-date', new Date().toString())

      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('shall perform connectivity check if last check was more than 24 hours ago', async () => {
      const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000)
      globalThis.localStorage.setItem('last-idp-connectivity-check-date', yesterday.toString())

      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      expect(fetchSpy).toHaveBeenCalledWith('https://api.ipify.org')
    })

    it('shall save timestamp to localStorage after successful connectivity check', async () => {
      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      expect(globalThis.localStorage.getItem('last-idp-connectivity-check-date')).toBeTruthy()
    })
  })

  describe('Handle connectivity check results', () => {
    it('shall log monitoring with connectivity results as an array', async () => {
      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      await flushPromises()

      const monitoringRequests = fakeAxios.history.post.filter((req) => req.url === '/api/jslog/monitoring')
      expect(monitoringRequests.length).toBeGreaterThan(0)
      const body = JSON.parse(monitoringRequests[0].data)
      const connectivity = JSON.parse(body.info.connectivity)
      expect(Array.isArray(connectivity)).toBe(true)
      expect(connectivity.length).toBeGreaterThan(0)
    })

    it('shall log monitoring with connected true when image loads successfully', async () => {
      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      await flushPromises()

      const monitoringRequests = fakeAxios.history.post.filter((req) => req.url === '/api/jslog/monitoring')
      expect(monitoringRequests.length).toBeGreaterThan(0)
      const body = JSON.parse(monitoringRequests[0].data)
      const connectivity = JSON.parse(body.info.connectivity)
      expect(connectivity[0].connected).toBe(true)
      expect(connectivity[0].url).toBe(IDP_URL_1)
    })

    it('shall log monitoring with connected false when image fails to load', async () => {
      // Override Image mock to trigger onerror instead of onload
      vi.stubGlobal(
        'Image',
        class MockImage {
          onload: (() => void) | null = null

          onerror: (() => void) | null = null

          private internalSrc = ''

          constructor() {
            imageInstances.push(this)
          }

          get src() {
            return this.internalSrc
          }

          set src(value: string) {
            this.internalSrc = value
            setTimeout(() => {
              if (this.onerror) {
                this.onerror()
              }
            }, 0)
          }
        }
      )

      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      await flushPromises()

      const monitoringRequests = fakeAxios.history.post.filter((req) => req.url === '/api/jslog/monitoring')
      expect(monitoringRequests.length).toBeGreaterThan(0)
      const body = JSON.parse(monitoringRequests[0].data)
      const connectivity = JSON.parse(body.info.connectivity)
      expect(connectivity[0].connected).toBe(false)
      expect(connectivity[0].url).toBe(IDP_URL_1)
    })

    it('shall log error when ip lookup fails', async () => {
      fetchSpy.mockRejectedValue(new Error('Network error'))

      testStore.dispatch(updateConfig(getConfigWithIdpUrls([IDP_URL_1])))
      testStore.dispatch(getUserSuccess({ user: getLoggedInUser(), links: [] as ResourceLink[] }))

      await flushPromises()
      await flushPromises()

      const errorRequests = fakeAxios.history.post.filter((req) => req.url === '/api/log/error')
      expect(errorRequests.length).toBeGreaterThan(0)
    })
  })
})
