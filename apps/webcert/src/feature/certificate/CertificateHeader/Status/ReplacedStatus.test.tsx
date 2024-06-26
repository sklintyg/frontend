import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { fakeCertificateMetaData } from '../../../../faker'
import store from '../../../../store/store'
import { CertificateRelationType, CertificateStatus } from '../../../../types'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'

const renderComponent = (childStatus?: CertificateStatus) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={
            childStatus
              ? fakeCertificateMetaData({
                  status: CertificateStatus.SIGNED,
                  relations: {
                    children: [
                      {
                        status: childStatus,
                        type: CertificateRelationType.REPLACED,
                      },
                    ],
                  },
                  sent: true,
                })
              : fakeCertificateMetaData({ status: CertificateStatus.SIGNED, sent: true })
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
