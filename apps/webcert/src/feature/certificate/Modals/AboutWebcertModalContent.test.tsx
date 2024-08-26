import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateConfig } from '../../../store/utils/utilsActions'
import { utilsMiddleware } from '../../../store/utils/utilsMiddleware'
import type { Configuration } from '../../../store/utils/utilsReducer'
import AboutWebcertModalContent from './AboutWebcertModalContent'

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
