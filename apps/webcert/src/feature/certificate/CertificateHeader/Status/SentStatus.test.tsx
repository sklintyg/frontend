import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { fakeCertificateMetaData } from '../../../../faker'
import store from '../../../../store/store'
import type { Question} from '../../../../types';
import { CertificateRelationType, CertificateStatus, QuestionType } from '../../../../types'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'

const EXPECTED_TEXT = 'Intyget är skickat till Försäkringskassan'

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
              ? fakeCertificateMetaData({
                  status,
                  relations: {
                    parent: null,
                    children: [
                      {
                        type: childRelationType,
                        status: childStatus,
                      },
                    ],
                  },
                  sent: isSent,
                  sentTo: isSent ? 'Försäkringskassan' : undefined,
                })
              : fakeCertificateMetaData({ status, sent: isSent, sentTo: isSent ? 'Försäkringskassan' : undefined })
          }
          questions={
            hasUndhandledComplementQuestions
              ? [{ type: QuestionType.COMPLEMENT, handled: false } as Question]
              : [{ type: QuestionType.COMPLEMENT, handled: true } as Question]
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
