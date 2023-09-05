import { faker } from '@frontend/fake'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'
import 'whatwg-fetch'
import { server } from './mocks/server'
import { reset as resetCertificateFilter } from './store/slice/certificateFilter.slice'

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

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

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

  resetCertificateFilter()
})

// Clean up after the tests are finished.
afterAll(() => server.close())
