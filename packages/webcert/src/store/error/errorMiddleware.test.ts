import MockAdapter from 'axios-mock-adapter'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import reducer from '../reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../test/dispatchHelperMiddleware'
import apiMiddleware from '../api/apiMiddleware'
import { errorMiddleware } from './errorMiddleware'
import { createError } from './errorActions'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test session middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, errorMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle create error', () => {
    it('shall...', async () => {
      testStore.dispatch(createError({ message: 'This is an error!' }))
      await flushPromises()
      expect(testStore.getState().ui.uiError.error).toBeTruthy()
    })
  })
})
