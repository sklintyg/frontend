import { faker } from '@frontend/fake'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'
import 'whatwg-fetch'
import { server } from './mocks/server'
import { api } from './store/api'
import { hsaApi } from './store/hsaApi'
import { reset as resetCertificatesFilter } from './store/slices/luCertificatesFilter.slice'
import { resetLUTableColumns } from './store/slices/luTableColumns.slice'
import { resetLUUnitTableColumns } from './store/slices/luUnitTableColumns.slice'
import { resetPatientTableColumns } from './store/slices/patientTableColumns.slice'
import { resetSettingsState } from './store/slices/settings.slice'
import { reset as resetSickLeaveFilter } from './store/slices/sickLeaveFilter.slice'
import { resetSickLeaveTableColumns } from './store/slices/sickLeaveTableColumns.slice'
import { store } from './store/store'

Object.assign(global, global, {
  open: vi.fn(),
  scrollTo: vi.fn(),
})

// Used by floating-ui
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Establish API mocking before all tests.
beforeAll(() => {
  // Set faker to use swedish locale
  faker.setLocale('sv')

  // Start MSW server
  server.listen({ onUnhandledRequest: 'error' })
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
  store.dispatch(resetSettingsState())
  store.dispatch(resetCertificatesFilter())
  store.dispatch(resetSickLeaveFilter())

  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  server.resetHandlers()
})

// Clean up after the tests are finished.
afterAll(() => server.close())
