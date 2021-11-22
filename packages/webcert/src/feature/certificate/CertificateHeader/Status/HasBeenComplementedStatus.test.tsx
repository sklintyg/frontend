import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CertificateEvent, CertificateEventType, CertificateStatus } from '../../../../../../common/src/types/certificate'
import HasBeenComplementedStatus from './HasBeenComplementedStatus'
import { BrowserRouter } from 'react-router-dom'

const EXPECTED_SIGNED_TEXT = 'Intyget har kompletterats med ett annat intyg.'
const EXPECTED_SIGNED_LINK = 'Öppna intyget.'
const EXPECTED_UNSIGNED_TEXT = 'Det finns redan en påbörjad komplettering.'
const EXPECTED_UNSIGNED_LINK = 'Öppna utkastet.'

const renderComponent = (historyEntries: CertificateEvent[]) => {
  render(
    <BrowserRouter>
      <HasBeenComplementedStatus historyEntries={historyEntries} />
    </BrowserRouter>
  )
}

describe('Has been complemented status', () => {
  it('displays status if signed complementing certificate exists', () => {
    const events = createEvents(true)
    renderComponent(events)
    expect(screen.getByText(EXPECTED_SIGNED_TEXT, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('displays link if signed complementing certificate exists', () => {
    const events = createEvents(true)
    renderComponent(events)
    expect(screen.getByText(EXPECTED_SIGNED_LINK, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_LINK, { exact: false })).not.toBeInTheDocument()
  })

  it('displays status if unsigned complementing certificate exists', () => {
    const events = createEvents(false)
    renderComponent(events)
    expect(screen.getByText(EXPECTED_UNSIGNED_TEXT, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_SIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('displays link if unsigned complementing certificate exists', () => {
    const events = createEvents(false)
    renderComponent(events)
    expect(screen.getByText(EXPECTED_UNSIGNED_LINK, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_SIGNED_LINK, { exact: false })).not.toBeInTheDocument()
  })

  it('displays no status if no complementing certificate does not exists', () => {
    renderComponent([])
    expect(screen.queryByText(EXPECTED_SIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('displays no link if no complementing certificate does not exists', () => {
    renderComponent([])
    expect(screen.queryByText(EXPECTED_SIGNED_LINK, { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_LINK, { exact: false })).not.toBeInTheDocument()
  })
})

const createEvents = (signed: boolean): CertificateEvent[] => {
  return [
    {
      certificateId: 'certificateId',
      type: CertificateEventType.COMPLEMENTED,
      timestamp: 'timestamp',
      relatedCertificateId: 'relatedId',
      relatedCertificateStatus: signed ? CertificateStatus.SIGNED : CertificateStatus.UNSIGNED,
    },
  ]
}
