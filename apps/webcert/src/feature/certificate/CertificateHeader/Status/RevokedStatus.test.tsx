import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { fakeCertificateMetaData } from '../../../../faker'
import store from '../../../../store/store'
import { CertificateStatus } from '../../../../types'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'

const renderComponent = (isRevoked: boolean) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={
            isRevoked
              ? fakeCertificateMetaData({ status: CertificateStatus.REVOKED, sent: true })
              : fakeCertificateMetaData({ status: CertificateStatus.SIGNED, sent: true })
          }
          questions={[]}
        />
      </BrowserRouter>
    </Provider>
  )
}

describe('Revoked status', () => {
  it('should display status that the certificate is revoked', () => {
    renderComponent(true)
    expect(screen.getByText('Intyget är makulerat')).toBeInTheDocument()
  })

  it('should display heading of modal if clicking on link', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByText('Intyget är makulerat'))
    expect(screen.getByRole('heading', { name: 'Intyget är makulerat' })).toBeInTheDocument()
  })

  it('should display body of modal if clicking on link', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByText('Intyget är makulerat'))
    expect(screen.getByText('Intyget är inte längre tillgängligt för patienten i intyg, som nås via', { exact: false })).toBeInTheDocument()
  })

  it('should close modal correctly', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByText('Intyget är makulerat'))
    expect(screen.getByRole('button', { name: 'Stäng' })).toBeInTheDocument()
    await userEvent.click(screen.getByText('Stäng'))
    expect(
      screen.queryByText('Intyget är inte längre tillgängligt för patienten i intyg, som nås via', { exact: false })
    ).not.toBeInTheDocument()
  })

  it('should not render status if not revoked', async () => {
    renderComponent(false)
    expect(screen.queryByText('Intyget är makulerat')).not.toBeInTheDocument()
  })
})
