import { CertificateRelationType, CertificateStatus } from '@frontend/common'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../../../store/store'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { createCertificateMetadata, createCertificateMetadataWithChildRelation } from './statusTestUtils'

const EXPECTED_SIGNED_TEXT = 'Intyget har kompletterats med ett annat intyg.'
const EXPECTED_SIGNED_LINK = 'Öppna intyget.'
const EXPECTED_UNSIGNED_TEXT = 'Det finns redan en påbörjad komplettering.'
const EXPECTED_UNSIGNED_LINK = 'Öppna utkastet.'

const renderComponent = (status: CertificateStatus, includeEvent: boolean) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={
            includeEvent
              ? createCertificateMetadataWithChildRelation(CertificateStatus.SIGNED, status, CertificateRelationType.COMPLEMENTED, true)
              : createCertificateMetadata(CertificateStatus.SIGNED, true)
          }
          questions={[]}
        />
      </BrowserRouter>
    </Provider>
  )
}

describe('Has been complemented status', () => {
  it('displays status if signed complementing certificate exists', () => {
    renderComponent(CertificateStatus.SIGNED, true)
    expect(screen.getByText(EXPECTED_SIGNED_TEXT, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('displays link if signed complementing certificate exists', () => {
    renderComponent(CertificateStatus.SIGNED, true)
    expect(screen.getByText(EXPECTED_SIGNED_LINK, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_LINK, { exact: false })).not.toBeInTheDocument()
  })

  it('displays status if unsigned complementing certificate exists', () => {
    renderComponent(CertificateStatus.UNSIGNED, true)
    expect(screen.getByText(EXPECTED_UNSIGNED_TEXT, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_SIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('displays link if unsigned complementing certificate exists', () => {
    renderComponent(CertificateStatus.UNSIGNED, true)
    expect(screen.getByText(EXPECTED_UNSIGNED_LINK, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_SIGNED_LINK, { exact: false })).not.toBeInTheDocument()
  })

  it('displays no status if no complementing certificate does not exists', () => {
    renderComponent(CertificateStatus.UNSIGNED, false)
    expect(screen.queryByText(EXPECTED_SIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('displays no link if no complementing certificate does not exists', () => {
    renderComponent(CertificateStatus.UNSIGNED, false)
    expect(screen.queryByText(EXPECTED_SIGNED_LINK, { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_LINK, { exact: false })).not.toBeInTheDocument()
  })

  it('displays no status if revoked complementing certificate exists', () => {
    renderComponent(CertificateStatus.REVOKED, true)
    expect(screen.queryByText(EXPECTED_SIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('displays no status if revoked complementing certificate exists', () => {
    renderComponent(CertificateStatus.REVOKED, true)
    expect(screen.queryByText(EXPECTED_SIGNED_LINK, { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText(EXPECTED_UNSIGNED_LINK, { exact: false })).not.toBeInTheDocument()
  })
})
