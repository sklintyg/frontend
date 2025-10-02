/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@frontend/fake'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'
import 'whatwg-fetch'
import { server } from './mocks/server'
import { api } from './store/api'
import { reset as resetCertificateFilter } from './store/slice/certificateFilter.slice'
import { reset as resetSession } from './store/slice/session.slice'
import { store } from './store/store'

beforeEach(() => {
  vi.spyOn(global.crypto, 'randomUUID').mockReturnValue('5f92e947-e2ee-4238-bf29-4cdc6b6c4b54')
})

// Establish API mocking before all tests.
beforeAll(() => {
  // Set faker to use swedish locale
  faker.setLocale('sv')

  // Start MSW server
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  vi.restoreAllMocks()

  // runs a cleanup after each test case (e.g. clearing jsdom)
  cleanup()

  store.dispatch(resetCertificateFilter())
  store.dispatch(resetSession())
  store.dispatch(api.util.resetApiState())
})

// Clean up after the tests are finished.
afterAll(() => server.close())
