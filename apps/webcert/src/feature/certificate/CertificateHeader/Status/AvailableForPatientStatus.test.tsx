import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeCertificateMetaData } from '../../../../faker'
import store from '../../../../store/store'
import { CertificateStatus } from '../../../../types'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'

const renderComponent = (isSigned: boolean, type?: string) => {
  render(
    <Provider store={store}>
      <CertificateHeaderStatuses
        certificateMetadata={fakeCertificateMetaData({
          status: isSigned ? CertificateStatus.SIGNED : CertificateStatus.UNSIGNED,
          sent: false,
          type,
        })}
        questions={[]}
      />
    </Provider>
  )
}

describe('Available for patient status', () => {
  it('should display that the certificate is available for the patient', async () => {
    renderComponent(true)
    expect(screen.getByText('Intyget är tillgängligt för patienten')).toBeInTheDocument()
  })

  it('should show modal header', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByText('Intyget är tillgängligt för patienten'))

    expect(
      screen.getByRole('heading', {
        name: 'Intyget är tillgängligt för patienten',
      })
    ).toBeInTheDocument()
  })

  it('should show modal body', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByText('Intyget är tillgängligt för patienten'))

    expect(screen.getByText('Intyget är tillgängligt för patienten i intyg, som nås via', { exact: false })).toBeInTheDocument()
  })

  it('should close modal when pressing close button', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByText('Intyget är tillgängligt för patienten'))
    await userEvent.click(screen.getByRole('button', { name: 'Stäng' }))
    expect(screen.queryByText('Intyget är tillgängligt för patienten i intyg, som nås via')).not.toBeInTheDocument()
  })

  it('should not render status if certificate is unsigned', () => {
    renderComponent(false)
    expect(screen.queryByText('Intyget är tillgängligt för patienten')).not.toBeInTheDocument()
  })

  it('should not render status if certificate is death certificate', () => {
    renderComponent(true, 'db')
    expect(screen.queryByText('Intyget är tillgängligt för patienten')).not.toBeInTheDocument()
  })

  it('should not render status if certificate is cause of death certificate', () => {
    renderComponent(true, 'doi')
    expect(screen.queryByText('Intyget är tillgängligt för patienten')).not.toBeInTheDocument()
  })

  it('shall render specific text in modal if certificate is lisjp', async () => {
    renderComponent(true, 'lisjp')

    await userEvent.click(screen.getByText(/intyget är tillgängligt för patienten/i))
    expect(
      screen.getByText('Intyget går även att nå via Försäkringskassans e-tjänst för ansökan om sjukpenning.', { exact: false })
    ).toBeInTheDocument()
  })

  it('shall not render specific text in modal if certificate is not lisjp', async () => {
    renderComponent(true, 'ag7804')
    await userEvent.click(screen.getByText(/intyget är tillgängligt för patienten/i))
    expect(
      screen.queryByText('Intyget går även att nå via Försäkringskassans e-tjänst för ansökan om sjukpenning.', { exact: false })
    ).not.toBeInTheDocument()
  })
})
