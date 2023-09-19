import { faker } from '@frontend/fake'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { mockViewport } from 'jsdom-testing-mocks'
import { vi } from 'vitest'
import 'whatwg-fetch'
import { server } from './mocks/server'

Object.assign(global, global, {
  open: vi.fn(),
  scrollTo: vi.fn(),
  visualViewport: {
    ...mockViewport({ width: '1440px', height: '900px' }),
    addEventListener: vi.fn(),
  },
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
})

// Clean up after the tests are finished.
afterAll(() => server.close())
