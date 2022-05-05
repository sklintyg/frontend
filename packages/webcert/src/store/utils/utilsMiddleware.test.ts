import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import { utilsMiddleware } from './utilsMiddleware'
import dispatchHelperMiddleware from '../test/dispatchHelperMiddleware'
import { Configuration } from './utilsReducer'
import { getConfig } from './utilsActions'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test utils middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, utilsMiddleware),
    })
  })

  it('should handle get config', async () => {
    const config = { version: '1.0' } as Configuration
    fakeAxios.onGet('/api/configuration').reply(200, config)
    testStore.dispatch(getConfig())

    await flushPromises()
    expect(testStore.getState().ui.uiUtils.config).toEqual(config)
  })
})
