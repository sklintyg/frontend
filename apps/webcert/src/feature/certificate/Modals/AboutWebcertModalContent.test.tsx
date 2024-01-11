import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { expect, it, describe, beforeEach } from 'vitest'
import AboutWebcertModalContent from './AboutWebcertModalContent'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateConfig } from '../../../store/utils/utilsActions'
import { utilsMiddleware } from '../../../store/utils/utilsMiddleware'
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
    testStore = configureApplicationStore([utilsMiddleware])
  })

  it('should render version', () => {
    setFakeVersion()
    renderComponent()

    expect(screen.getByText('Nuvarande version är 1.0.')).toBeInTheDocument()
  })
})
