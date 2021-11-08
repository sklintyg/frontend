import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../../store/reducers'
import SigningForm from './SigningForm'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { SigningData, updateCertificateSigningData } from '../../../store/certificate/certificateActions'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <SigningForm />
    </Provider>
  )
}

describe('SigningForm', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
    })
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
