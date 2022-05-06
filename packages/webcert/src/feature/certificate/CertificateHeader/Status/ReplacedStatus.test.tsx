import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { BrowserRouter } from 'react-router-dom'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { createCertificateMetadata, createCertificateMetadataWithChildRelation } from './statusTestUtils'
import { CertificateRelationType, CertificateStatus } from '@frontend/common/src'

const renderComponent = (childStatus?: CertificateStatus) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={
            childStatus
              ? createCertificateMetadataWithChildRelation(CertificateStatus.SIGNED, childStatus, CertificateRelationType.REPLACED, true)
              : createCertificateMetadata(CertificateStatus.SIGNED, true)
          }
          questions={[]}
        />
      </BrowserRouter>
    </Provider>
  )
}

describe('Replaced status', () => {
  it('should display that the certificate is replaced by a signed certificate', () => {
    renderComponent(CertificateStatus.SIGNED)
    expect(screen.getByText('Intyget har ersatts av')).toBeInTheDocument()
    expect(screen.getByText('detta intyg', { exact: false })).toBeInTheDocument()
  })

  it('should display that the certificate is replaced by an unsigned certificate', () => {
    renderComponent(CertificateStatus.UNSIGNED)
    expect(screen.getByText('Det finns redan ett påbörjat utkast som ska ersätta detta intyg.')).toBeInTheDocument()
    expect(screen.getByText('Öppna utkastet')).toBeInTheDocument()
  })

  it('should not display status if not replaced', () => {
    renderComponent()
    expect(screen.queryByText('Intyget har ersatts av')).not.toBeInTheDocument()
    expect(screen.queryByText('Det finns redan ett påbörjat utkast som ska ersätta detta intyg.')).not.toBeInTheDocument()
  })

  it('should not display status if child is revoked', () => {
    renderComponent(CertificateStatus.REVOKED)
    expect(screen.queryByText('Intyget har ersatts av')).not.toBeInTheDocument()
    expect(screen.queryByText('Det finns redan ett påbörjat utkast som ska ersätta detta intyg.')).not.toBeInTheDocument()
  })
})
