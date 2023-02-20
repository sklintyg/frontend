import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect } from 'vitest'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

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
