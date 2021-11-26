import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { CertificateStatus } from '@frontend/common/src'
import { createCertificateMetadata } from './statusTestUtils'

const renderComponent = (isSigned: boolean, type?: string) => {
  render(
    <Provider store={store}>
      <CertificateHeaderStatuses
        certificateMetadata={createCertificateMetadata(isSigned ? CertificateStatus.SIGNED : CertificateStatus.UNSIGNED, type)}
        historyEntries={[]}
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

  it('should show modal header', () => {
    renderComponent(true)
    userEvent.click(screen.getByText('Intyget är tillgängligt för patienten'))

    expect(
      screen.getByRole('heading', {
        name: 'Intyget är tillgängligt för patienten',
      })
    ).toBeInTheDocument()
  })

  it('should show modal body', () => {
    renderComponent(true)
    userEvent.click(screen.getByText('Intyget är tillgängligt för patienten'))

    expect(screen.getByText('Intyget är tillgängligt för patienten i mina intyg, som nås via', { exact: false })).toBeInTheDocument()
  })

  it('should close modal when pressing close button', () => {
    renderComponent(true)
    userEvent.click(screen.getByText('Intyget är tillgängligt för patienten'))
    userEvent.click(screen.getByRole('button', { name: 'Stäng' }))
    expect(screen.queryByText('Intyget är tillgängligt för patienten i mina intyg, som nås via')).not.toBeInTheDocument()
  })

  it('should not render status if certificate is unsigned', () => {
    renderComponent(false)
    expect(screen.queryByText('Intyget är tillgängligt för patienten')).not.toBeInTheDocument()
  })

  it('shall render specific text in modal if certificate is lisjp', () => {
    renderComponent(true, 'lisjp')

    userEvent.click(screen.getByText(/intyget är tillgängligt för patienten/i))
    expect(
      screen.queryByText('Intyget går även att nå via Försäkringskassans e-tjänst för ansökan om sjukpenning.', { exact: false })
    ).toBeInTheDocument()
  })

  it('shall not render specific text in modal if certificate is not lisjp', () => {
    renderComponent(true, 'ag7804')
    userEvent.click(screen.getByText(/intyget är tillgängligt för patienten/i))
    expect(
      screen.queryByText('Intyget går även att nå via Försäkringskassans e-tjänst för ansökan om sjukpenning.', { exact: false })
    ).not.toBeInTheDocument()
  })
})
