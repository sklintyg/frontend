import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { BrowserRouter } from 'react-router-dom'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { createCertificateMetadata } from './statusTestUtils'
import { CertificateStatus } from '@frontend/common/src'

const renderComponent = (isRevoked: boolean) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={
            isRevoked ? createCertificateMetadata(CertificateStatus.REVOKED) : createCertificateMetadata(CertificateStatus.SIGNED)
          }
          historyEntries={[]}
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

  it('should display heading of modal if clicking on link', () => {
    renderComponent(true)
    userEvent.click(screen.getByText('Intyget är makulerat'))
    expect(screen.getByRole('heading', { name: 'Intyget är makulerat' })).toBeInTheDocument()
  })

  it('should display body of modal if clicking on link', () => {
    renderComponent(true)
    userEvent.click(screen.getByText('Intyget är makulerat'))
    expect(
      screen.getByText('Intyget är inte längre tillgängligt för patienten i mina intyg, som nås via', { exact: false })
    ).toBeInTheDocument()
  })

  it('should close modal correctly', () => {
    renderComponent(true)
    userEvent.click(screen.getByText('Intyget är makulerat'))
    expect(screen.getByRole('button', { name: 'Stäng' })).toBeInTheDocument()
    userEvent.click(screen.getByText('Stäng'))
    expect(
      screen.queryByText('Intyget är inte längre tillgängligt för patienten i mina intyg, som nås via', { exact: false })
    ).not.toBeInTheDocument()
  })

  it('should not render status if not revoked', async () => {
    renderComponent(false)
    expect(screen.queryByText('Intyget är makulerat')).not.toBeInTheDocument()
  })
})
