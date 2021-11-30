import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CertificateRelationType, CertificateStatus } from '../../../../../../common/src/types/certificate'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { BrowserRouter } from 'react-router-dom'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { createCertificateMetadata, createCertificateMetadataWithChildRelation } from './statusTestUtils'
import { QuestionType } from '@frontend/common/src'

const EXPECTED_TEXT = 'Intyget är skickat till'

const renderComponent = (
  isSent: boolean,
  status: CertificateStatus,
  childStatus: CertificateStatus | undefined,
  hasUndhandledComplementQuestions: boolean,
  childRelationType?: CertificateRelationType
) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={
            childRelationType && childStatus
              ? createCertificateMetadataWithChildRelation(status, childStatus, childRelationType, isSent)
              : createCertificateMetadata(status, isSent)
          }
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

describe('Sent status', () => {
  it('displays that the certificate is sent if signed, sent, not replaced, has no unhandled complement questions and is not complemented', () => {
    renderComponent(true, CertificateStatus.SIGNED, undefined, false)
    expect(screen.getByText(EXPECTED_TEXT, { exact: false })).toBeInTheDocument()
  })

  it('doesnt render anything if certificate is not sent', () => {
    renderComponent(false, CertificateStatus.SIGNED, undefined, false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate is not signed', () => {
    renderComponent(false, CertificateStatus.UNSIGNED, undefined, false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has been complemented by draft', () => {
    renderComponent(true, CertificateStatus.SIGNED, CertificateStatus.UNSIGNED, false, CertificateRelationType.COMPLEMENTED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has been complemented by signed certificate', () => {
    renderComponent(true, CertificateStatus.SIGNED, CertificateStatus.SIGNED, false, CertificateRelationType.COMPLEMENTED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should render status if certificate has been complemented by revoked certificate', () => {
    renderComponent(true, CertificateStatus.SIGNED, CertificateStatus.REVOKED, false, CertificateRelationType.COMPLEMENTED)
    expect(screen.getByText(EXPECTED_TEXT, { exact: false })).toBeInTheDocument()
  })

  it('doesnt render anything if certificate has unhandled complements', () => {
    renderComponent(true, CertificateStatus.SIGNED, undefined, true)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has been complemented and has undhandled complements', () => {
    renderComponent(true, CertificateStatus.SIGNED, CertificateStatus.SIGNED, true, CertificateRelationType.COMPLEMENTED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should not render status if certificate has been replaced with draft', () => {
    renderComponent(true, CertificateStatus.SIGNED, CertificateStatus.UNSIGNED, false, CertificateRelationType.REPLACED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should not render status if certificate has been replaced with signed draft', () => {
    renderComponent(true, CertificateStatus.SIGNED, CertificateStatus.SIGNED, false, CertificateRelationType.REPLACED)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should show status if certificate has been replaced with revoked certficate', () => {
    renderComponent(true, CertificateStatus.SIGNED, CertificateStatus.REVOKED, false, CertificateRelationType.REPLACED)
    expect(screen.getByText(EXPECTED_TEXT, { exact: false })).toBeInTheDocument()
  })
})
