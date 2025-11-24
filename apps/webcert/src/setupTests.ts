import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { api } from './store/api'
import { ppApi } from './store/pp/ppApi'
import store from './store/store'

// Add modalRool container for ModalBase containers
beforeEach(() => {
  document.body.innerHTML = `
        <div id="modalRoot"></div>
    `
})

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  store.dispatch(api.util.resetApiState())
  store.dispatch(ppApi.util.resetApiState())
  cleanup()
})
