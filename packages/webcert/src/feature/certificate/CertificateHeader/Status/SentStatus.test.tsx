import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CertificateStatus } from '../../../../../../common/src/types/certificate'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { BrowserRouter } from 'react-router-dom'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { createCertificateMetadataWithReplacedOption, createHistoryEntriesWithComplementEvent } from './statusTestUtils'
import { QuestionType } from '@frontend/common/src'

const EXPECTED_TEXT = 'Intyget är skickat till'

const renderComponent = (
  isSent: boolean,
  isSigned: boolean,
  isReplaced: boolean,
  childStatus: CertificateStatus | undefined,
  isRevoked: boolean,
  hasUndhandledComplementQuestions: boolean,
  isComplemented: boolean,
  complementStatus?: CertificateStatus
) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={getMetadata(isSent, isSigned, isReplaced, childStatus, isRevoked)}
          historyEntries={isComplemented && complementStatus ? createHistoryEntriesWithComplementEvent(complementStatus) : []}
          questions={
            hasUndhandledComplementQuestions
              ? [{ type: QuestionType.COMPLEMENT, handled: false }]
              : [{ type: QuestionType.COMPLEMENT, handled: true }]
          }
        />
      </BrowserRouter>
    </Provider>
  )
}

const getMetadata = (
  isSent: boolean,
  isSigned: boolean,
  isReplaced: boolean,
  childStatus: CertificateStatus | undefined,
  isRevoked: boolean
) => {
  return createCertificateMetadataWithReplacedOption(
    isRevoked ? CertificateStatus.REVOKED : isSigned ? CertificateStatus.SIGNED : CertificateStatus.UNSIGNED,
    isReplaced,
    childStatus,
    isSent
  )
}

describe('Sent status', () => {
  it('displays that the certificate is sent if signed, sent, not replaced, has no unhandled complement questions and is not complemented', () => {
    renderComponent(true, true, false, undefined, false, false, false)
    expect(screen.getByText(EXPECTED_TEXT, { exact: false })).toBeInTheDocument()
  })

  it('doesnt render anything if certificate is not sent', () => {
    renderComponent(false, true, false, undefined, false, false, false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate is not signed', () => {
    renderComponent(false, false, false, undefined, false, false, false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has been complemented by draft', () => {
    renderComponent(true, true, false, undefined, false, false, true, CertificateStatus.UNSIGNED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has been complemented by signed certificate', () => {
    renderComponent(true, true, false, undefined, false, false, true, CertificateStatus.SIGNED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should render status if certificate has been complemented by revoked certificate', () => {
    renderComponent(true, true, false, undefined, false, false, true, CertificateStatus.REVOKED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has unhandled complements', () => {
    renderComponent(true, true, false, undefined, false, true, false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has been complemented and has undhandled complements', () => {
    renderComponent(true, true, false, undefined, false, true, true, CertificateStatus.UNSIGNED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should not render status if certificate has been replaced with draft', () => {
    renderComponent(true, true, true, CertificateStatus.UNSIGNED, false, false, false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should not render status if certificate has been replaced with signed draft', () => {
    renderComponent(true, true, true, CertificateStatus.SIGNED, false, true, false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should show status if certificate has been replaced with revoked certficate', () => {
    renderComponent(true, true, true, CertificateStatus.REVOKED, false, false, false)
    expect(screen.getByText(EXPECTED_TEXT, { exact: false })).toBeInTheDocument()
  })
})
