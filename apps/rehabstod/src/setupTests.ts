/* eslint-disable @typescript-eslint/ban-ts-comment */
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
// import 'whatwg-fetch'
// import nodeFetch, { Request, Response } from 'node-fetch'
import { server } from './mocks/server'
import { api } from './store/api'
import { hsaApi } from './store/hsaApi'
import { store } from './store/store'

// // @ts-ignore
// global.fetch = nodeFetch
// // @ts-ignore
// global.Request = Request
// // @ts-ignore
// global.Response = Response

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  // runs a cleanup after each test case (e.g. clearing jsdom)
  cleanup()

  // Reset api states
  store.dispatch(api.util.resetApiState())
  store.dispatch(hsaApi.util.resetApiState())

  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  server.resetHandlers()
})

// Clean up after the tests are finished.
afterAll(() => server.close())
