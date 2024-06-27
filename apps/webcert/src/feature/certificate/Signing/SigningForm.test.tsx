import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { SigningData } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { updateCertificateSigningData } from '../../../store/certificate/certificateSlice'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import SigningForm from './SigningForm'

let testStore: EnhancedStore

const mockSubmit = vi.fn()

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <SigningForm />
    </Provider>
  )
}

const setDefaultStoreValues = () => {
  const signingData = { id: 'testId', signRequest: 'signRequest', actionUrl: 'actionUrl' } as SigningData
  testStore.dispatch(updateCertificateSigningData(signingData))
}

describe('SigningForm', () => {
  beforeEach(() => {
    window.HTMLFormElement.prototype.submit = mockSubmit
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('displays nothing when empty signingData state', () => {
    renderDefaultComponent()

    expect(screen.queryByRole('input')).not.toBeInTheDocument()
  })

  it('displays form when correct signingData state', () => {
    setDefaultStoreValues()
    renderDefaultComponent()
    expect(screen.getAllByRole('textbox', { hidden: true })[0]).toBeInTheDocument()
  })
})
