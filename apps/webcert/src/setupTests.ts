import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'

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
