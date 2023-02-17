import { CertificateStatus } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../../store/store'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { createCertificateMetadata } from './statusTestUtils'

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
