import { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { apiMiddleware } from '../api/apiMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import dispatchHelperMiddleware from '../test/dispatchHelperMiddleware'
import { getConfig } from './utilsActions'
import { utilsMiddleware } from './utilsMiddleware'
import { Configuration } from './utilsReducer'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test utils middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, utilsMiddleware])
  })

  it('should handle get config', async () => {
    const config = { version: '1.0' } as Configuration
    fakeAxios.onGet('/api/configuration').reply(200, config)
    testStore.dispatch(getConfig())

    await flushPromises()
    expect(testStore.getState().ui.uiUtils.config).toEqual(config)
  })
})
