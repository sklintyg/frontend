import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { mockViewport } from 'jsdom-testing-mocks'
import { afterEach } from 'vitest'

Object.assign(global, global, {
  open: vi.fn(),
  scrollTo: vi.fn(),
  visualViewport: {
    ...mockViewport({ width: '1440px', height: '900px' }),
    addEventListener: vi.fn(),
  },
})

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
