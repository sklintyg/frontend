import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

beforeAll(() => {
  // Mock needed for react-tooltip
  window.ResizeObserver = class ResizeObserver {
    // eslint-disable-next-line class-methods-use-this
    observe() {}

    // eslint-disable-next-line class-methods-use-this
    unobserve() {}

    // eslint-disable-next-line class-methods-use-this
    disconnect() {}
  }
})

// Add modalRool container for ModalBase containers
beforeEach(() => {
  document.body.innerHTML = `
        <div id="modalRoot"></div>
    `
})

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
