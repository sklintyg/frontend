import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  )
  // jsdom does not implement scrollIntoView, but @inera/ids-react calls it on focus anchors.
  Element.prototype.scrollIntoView = vi.fn()
})

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
