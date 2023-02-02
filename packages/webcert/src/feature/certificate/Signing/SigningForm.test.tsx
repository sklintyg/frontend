import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { EnhancedStore } from '@reduxjs/toolkit'
import SigningForm from './SigningForm'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { SigningData, updateCertificateSigningData } from '../../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../../store/configureApplicationStore'

let testStore: EnhancedStore

const mockSubmit = jest.fn()

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <SigningForm />
    </Provider>
  )
}

describe('SigningForm', () => {
  beforeEach(() => {
    window.HTMLFormElement.prototype.submit = mockSubmit
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('renders without crashing', () => {
    renderDefaultComponent()
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

const setDefaultStoreValues = () => {
  const signingData = { id: 'testId', signRequest: 'signRequest', actionUrl: 'actionUrl' } as SigningData
  testStore.dispatch(updateCertificateSigningData(signingData))
}
