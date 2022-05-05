import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { utilsMiddleware } from '../../../store/utils/utilsMiddleware'
import reducer from '../../../store/reducers'
import AboutWebcertModalContent from './AboutWebcertModalContent'
import { updateConfig } from '../../../store/utils/utilsActions'
import { Configuration } from '../../../store/utils/utilsReducer'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <AboutWebcertModalContent />
    </Provider>
  )
}

const setFakeVersion = () => {
  const config = { version: '1.0' } as Configuration
  testStore.dispatch(updateConfig(config))
}

describe('AboutWebcertModalContent', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(utilsMiddleware),
    })
  })

  it('should render version', () => {
    setFakeVersion()
    renderComponent()

    expect(screen.getByText('Nuvarande version är 1.0.')).toBeInTheDocument()
  })
})
