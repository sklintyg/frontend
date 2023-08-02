import {
  CertificateEvent,
  CertificateEventType,
  CertificateMetadata,
  CertificateRelationType,
  CertificateStatus,
  fakeCertificateMetaData,
} from '@frontend/common'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ShowHistory from './ShowHistory'

const certificateMetadata: CertificateMetadata = fakeCertificateMetaData({
  type: 'lisjp',
  sentTo: 'Försäkringskassan',
})

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
    await act(() => userEvent.click(screen.getByText('Visa alla händelser')))

    expect(screen.getByText(/utkastet är skapat/i)).toBeInTheDocument()
    expect(screen.getByText(/intyget är signerat/i)).toBeInTheDocument()
    expect(screen.getByText(/intyget är tillgängligt för patienten/i)).toBeInTheDocument()
    expect(screen.getByText(/intyget är skickat till Försäkringskassan/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /stäng/i })).toBeInTheDocument()

    await act(() => userEvent.click(screen.getByRole('button', { name: /stäng/i })))

    expect(screen.queryByText(/utkastet är skapat/i)).not.toBeInTheDocument()
  })

  it('displays spinner if history events have not been loaded yet', async () => {
    const mockHistoryEntries: CertificateEvent[] = []

    render(<ShowHistory certificateMetadata={certificateMetadata} historyEntries={mockHistoryEntries} />)
    await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
    expect(screen.getByText('Laddar händelser')).toBeInTheDocument()
  })

  it('does not display spinner if history events have been loaded', async () => {
    const mockHistoryEntries: CertificateEvent[] = [
      {
        certificateId: 'xxxx',
        type: CertificateEventType.CREATED,
        timestamp: '2020-10-14T12:56:58.523Z',
        relatedCertificateId: null,
        relatedCertificateStatus: null,
      },
    ]

    render(<ShowHistory certificateMetadata={certificateMetadata} historyEntries={mockHistoryEntries} />)
    await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
    expect(screen.queryByText('Laddar händelser')).toBeNull()
  })

  describe('Renewal event', () => {
    it('Display event', async () => {
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
      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
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

      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))

      expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/relatedCertificateId')
    })
  })

  describe('Complements event', () => {
    //@ts-expect-error Only relevant data for test
    const certificateMetadata: CertificateMetadata = {
      type: 'lisjp',
    }

    it('Display event if unsigned', async () => {
      certificateMetadata.status = CertificateStatus.UNSIGNED
      const complementsHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.COMPLEMENTS,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: 'relatedCertificateId',
          relatedCertificateStatus: CertificateStatus.SIGNED,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={complementsHistoryEntry} />
        </BrowserRouter>
      )
      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
      expect(screen.getByText(/Utkastet är skapat för att komplettera ett tidigare intyg./i)).toBeInTheDocument()
      expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/relatedCertificateId')
    })

    it('Display event if signed', async () => {
      certificateMetadata.status = CertificateStatus.SIGNED
      const complementsHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.COMPLEMENTS,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: 'relatedCertificateId',
          relatedCertificateStatus: CertificateStatus.SIGNED,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={complementsHistoryEntry} />
        </BrowserRouter>
      )
      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
      expect(screen.getByText(/Utkastet är skapat för att komplettera ett tidigare intyg./i)).toBeInTheDocument()
      expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/relatedCertificateId')
    })

    it('Display event if revoked', async () => {
      certificateMetadata.status = CertificateStatus.REVOKED
      const complementsHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.COMPLEMENTS,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: 'relatedCertificateId',
          relatedCertificateStatus: CertificateStatus.SIGNED,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={complementsHistoryEntry} />
        </BrowserRouter>
      )
      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
      expect(screen.getByText(/Utkastet är skapat för att komplettera ett tidigare intyg./i)).toBeInTheDocument()
      expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/relatedCertificateId')
    })
  })

  describe('Revoke events', () => {
    //@ts-expect-error Only relevant data for test
    const certificateMetadata: CertificateMetadata = {
      type: 'lisjp',
      status: CertificateStatus.REVOKED,
      relations: {
        parent: null,
        children: [],
      },
    }

    it('Display revoke event', async () => {
      const complementsHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.REVOKED,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: null,
          relatedCertificateStatus: null,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={complementsHistoryEntry} />
        </BrowserRouter>
      )
      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
      expect(screen.getByText(/Intyget är makulerat/i)).toBeInTheDocument()
    })

    it('Display revoke event when parent was complemented but isnt revoked', async () => {
      certificateMetadata.relations.parent = {
        type: CertificateRelationType.COMPLEMENTED,
        status: CertificateStatus.SIGNED,
        certificateId: 'relatedCertificateId',
        created: new Date().toISOString(),
      }

      const complementsHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.REVOKED,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: null,
          relatedCertificateStatus: null,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={complementsHistoryEntry} />
        </BrowserRouter>
      )
      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
      expect(
        screen.getByText(/Intyget är makulerat. Intyget är en komplettering av ett tidigare intyg som också kan behöva makuleras./i)
      ).toBeInTheDocument()
      expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/relatedCertificateId')
    })

    it('Display revoke event when parent was replaced but isnt revoked', async () => {
      certificateMetadata.relations.parent = {
        type: CertificateRelationType.REPLACED,
        status: CertificateStatus.SIGNED,
        certificateId: 'relatedCertificateId',
        created: new Date().toISOString(),
      }

      const complementsHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.REVOKED,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: null,
          relatedCertificateStatus: null,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={complementsHistoryEntry} />
        </BrowserRouter>
      )
      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
      expect(
        screen.getByText(/Intyget är makulerat. Intyget ersatte ett tidigare intyg som också kan behöva makuleras./i)
      ).toBeInTheDocument()
      expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/relatedCertificateId')
    })

    it('should display correct revoked event for locked revoked draft', async () => {
      //@ts-expect-error Only relevant data for test
      const certificateMetadata: CertificateMetadata = {
        type: 'lisjp',
        status: CertificateStatus.LOCKED_REVOKED,
        relations: {
          parent: null,
          children: [],
        },
      }
      const complementsHistoryEntry: CertificateEvent[] = [
        {
          certificateId: 'certificateId',
          type: CertificateEventType.REVOKED,
          timestamp: '2020-10-14T12:56:58.523Z',
          relatedCertificateId: null,
          relatedCertificateStatus: null,
        },
      ]

      render(
        <BrowserRouter>
          <ShowHistory certificateMetadata={certificateMetadata} historyEntries={complementsHistoryEntry} />
        </BrowserRouter>
      )
      await act(() => userEvent.click(screen.getByText('Visa alla händelser')))
      expect(screen.getByText(/Utkastet är makulerat/i)).toBeInTheDocument()
    })
  })
})
