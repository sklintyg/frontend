import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeCertificateMetaData } from '../../../../faker'
import store from '../../../../store/store'
import { CertificateMetadata, CertificateStatus, Question, QuestionType } from '../../../../types'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'

const renderComponent = (certificateMetadata: CertificateMetadata, questions: Question[]) => {
  render(
    <Provider store={store}>
      <CertificateHeaderStatuses certificateMetadata={certificateMetadata} questions={questions} />
    </Provider>
  )
}

const EXPECTED_TEXT = 'Försäkringskassan har begärt komplettering'

describe('Complement status', () => {
  it('displays that FK has requested complements', () => {
    const questions = [{ type: QuestionType.COMPLEMENT, handled: false }] as Question[]
    const certificateMetadata = fakeCertificateMetaData({ status: CertificateStatus.SIGNED, sent: true })
    renderComponent(certificateMetadata, questions)

    expect(screen.getByText(EXPECTED_TEXT)).toBeInTheDocument()
  })

  it('doesnt render anything if empty question list', () => {
    const certificateMetadata = fakeCertificateMetaData({ status: CertificateStatus.SIGNED, sent: true })
    renderComponent(certificateMetadata, [])
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if no unhandled questions', () => {
    const questions = [{ type: QuestionType.COMPLEMENT, handled: true }] as Question[]
    const certificateMetadata = fakeCertificateMetaData({ status: CertificateStatus.SIGNED, sent: true })
    renderComponent(certificateMetadata, questions)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if wrong question types', () => {
    const questions = [
      { type: QuestionType.CONTACT, handled: false },
      {
        type: QuestionType.COORDINATION,
        handled: false,
      },
      { type: QuestionType.OTHER, handled: false },
      { type: QuestionType.MISSING, handled: false },
    ] as Question[]
    const certificateMetadata = fakeCertificateMetaData({ status: CertificateStatus.SIGNED, sent: true })
    renderComponent(certificateMetadata, questions)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if not signed', () => {
    const questions = [{ type: QuestionType.COMPLEMENT, handled: false }] as Question[]
    const certificateMetadata = fakeCertificateMetaData({ status: CertificateStatus.UNSIGNED, sent: true })
    renderComponent(certificateMetadata, questions)

    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should not render status if revoked', () => {
    const questions = [{ type: QuestionType.COMPLEMENT, handled: false }] as Question[]
    const certificateMetadata = fakeCertificateMetaData({ status: CertificateStatus.REVOKED, sent: true })
    renderComponent(certificateMetadata, questions)

    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })
})
