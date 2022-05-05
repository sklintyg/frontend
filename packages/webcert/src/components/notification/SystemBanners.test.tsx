import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../store/reducers'
import { updateConfig } from '../../store/utils/utilsActions'
import SystemBanners from './SystemBanners'
import { Configuration } from '../../store/utils/utilsReducer'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <SystemBanners />
    </Provider>
  )
}

const INFO_TEXT = 'Detta är ett informationsmeddelande.'

describe('SystemBanners', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })
  })

  it('shall render banner if it exists in state', () => {
    setState()
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render a banner if empty state', () => {
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })
})

const setState = () => {
  testStore.dispatch(updateConfig({ version: '1.0', banners: [{ message: INFO_TEXT, priority: 'HOG' }] } as Configuration))
}
