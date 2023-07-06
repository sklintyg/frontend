import { faker } from '@frontend/fake'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'
import { fetch, Headers, Request, Response } from 'cross-fetch'
import AbortController from 'abort-controller'
import { server } from './mocks/server'
import { api } from './store/api'
import { hsaApi } from './store/hsaApi'
import { resetLUTableColumns } from './store/slices/luTableColumns.slice'
import { resetLUUnitTableColumns } from './store/slices/luUnitTableColumns.slice'
import { resetPatientTableColumns } from './store/slices/patientTableColumns.slice'
import { resetSickLeaveTableColumns } from './store/slices/sickLeaveTableColumns.slice'
import { store } from './store/store'

Object.assign(global, global, {
  open: vi.fn(),
  scrollTo: vi.fn(),
  fetch,
  Headers,
  Request,
  Response,
  AbortController,
})

// Used by floating-ui
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Establish API mocking before all tests.
beforeAll(() => {
  // Set faker to use swedish locale
  faker.setLocale('sv')

  // Start MSW server
  server.listen({ onUnhandledRequest: 'error' })
})

beforeEach(() => {
  // Set faker to be predictable
  faker.seed(1234)
})

afterEach(() => {
  // runs a cleanup after each test case (e.g. clearing jsdom)
  cleanup()

  // Reset api states
  store.dispatch(api.util.resetApiState())
  store.dispatch(hsaApi.util.resetApiState())

  // Reset slice states
  store.dispatch(resetPatientTableColumns())
  store.dispatch(resetSickLeaveTableColumns())
  store.dispatch(resetLUUnitTableColumns())
  store.dispatch(resetLUTableColumns())

  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  server.resetHandlers()
})

// Clean up after the tests are finished.
afterAll(() => server.close())
