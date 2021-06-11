import React from 'react'
import { render, screen } from '@testing-library/react'
import ShowHistory from './ShowHistory'
import userEvent from '@testing-library/user-event'
import { CertificateEvent, CertificateEventType, CertificateMetadata, CertificateStatus } from '@frontend/common'
import { BrowserRouter } from 'react-router-dom'

//@ts-expect-error Only relevant data for test
const certificateMetadata: CertificateMetadata = {
  type: 'lisjp',
}

describe('Verify history events', () => {
  it('displays history entries', async () => {
    const mockHistoryEntries: CertificateEvent[] = [
      {
        certificateId: 'xxxx',
        type: CertificateEventType.CREATED,
        timestamp: '2020-10-14T12:56:58.523Z',
        relatedCertificateId: null,
        relatedCertificateStatus: null,
      },
      {
        certificateId: 'xxxx',
        type: CertificateEventType.SIGNED,
        timestamp: '2020-10-14T19:59:17.565Z',
        relatedCertificateId: null,
        relatedCertificateStatus: null,
      },
      {
        certificateId: 'xxxx',
        type: CertificateEventType.AVAILABLE_FOR_PATIENT,
        timestamp: '2020-10-14T19:59:17.565Z',
        relatedCertificateId: null,
        relatedCertificateStatus: null,
      },
      {
        certificateId: 'xxxx',
        type: CertificateEventType.SENT,
        timestamp: '2020-10-14T19:59:17.565Z',
        relatedCertificateId: null,
        relatedCertificateStatus: null,
      },
    ]

    render(<ShowHistory certificateMetadata={certificateMetadata} historyEntries={mockHistoryEntries} />)

    expect(screen.getByText('Visa alla händelser')).toBeInTheDocument()
    userEvent.click(screen.getByText('Visa alla händelser'))

    expect(screen.getByText(/utkastet är skapat/i)).toBeInTheDocument()
    expect(screen.getByText(/intyget är signerat/i)).toBeInTheDocument()
    expect(screen.getByText(/intyget är tillgängligt för patienten/i)).toBeInTheDocument()
    expect(screen.getByText(/intyget är skickat till Försäkringskassan/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /stäng/i })).toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: /stäng/i }))

    expect(screen.queryByText(/utkastet är skapat/i)).not.toBeInTheDocument()
  })

  describe('Renewal event', () => {
    it('display event', async () => {
      const renewHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.EXTENDED,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: 'relatedCertificateId',
          relatedCertificateStatus: CertificateStatus.SIGNED,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={renewHistoryEntry} />
        </BrowserRouter>
      )
      userEvent.click(screen.getByText('Visa alla händelser'))
      expect(screen.getByText(/utkastet skapades för att förnya ett tidigare intyg./i)).toBeInTheDocument()
    })

    it('Include link to open renewed certificate', async () => {
      const renewHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.EXTENDED,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: 'relatedCertificateId',
          relatedCertificateStatus: CertificateStatus.SIGNED,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={renewHistoryEntry} />
        </BrowserRouter>
      )

      userEvent.click(screen.getByText('Visa alla händelser'))

      expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/relatedCertificateId')
    })
  })
})
