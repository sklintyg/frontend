import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import store from '../../../../store/store'
import { BrowserRouter } from 'react-router-dom'
import { createCertificateMetadata } from './statusTestUtils'
import { CertificateStatus } from '@frontend/common/src'
import { Provider } from 'react-redux'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'

const renderComponent = (isSigned: boolean, isValidForSigning: boolean) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={createCertificateMetadata(isSigned ? CertificateStatus.SIGNED : CertificateStatus.UNSIGNED, isSigned)}
          questions={[]}
          isValidForSigning={isValidForSigning}
        />
      </BrowserRouter>
    </Provider>
  )
}
describe('Signable status', () => {
  it('should display that the certificate is not ready for signing', () => {
    renderComponent(false, false)
    expect(screen.getByText('Obligatoriska uppgifter saknas')).toBeInTheDocument()
  })

  it('should display that the certificate is ready for signing', () => {
    renderComponent(false, true)
    expect(screen.getByText('Klart att signera')).toBeInTheDocument()
  })

  it('should not display status if certificate is signed', () => {
    renderComponent(true, true)
    expect(screen.queryByText('Klart att signera')).not.toBeInTheDocument()
    expect(screen.queryByText('Obligatoriska uppgifter saknas')).not.toBeInTheDocument()
  })

  it('should not display status if certificate is signed, different valid for signing value', () => {
    renderComponent(true, false)
    expect(screen.queryByText('Klart att signera')).not.toBeInTheDocument()
    expect(screen.queryByText('Obligatoriska uppgifter saknas')).not.toBeInTheDocument()
  })
})
