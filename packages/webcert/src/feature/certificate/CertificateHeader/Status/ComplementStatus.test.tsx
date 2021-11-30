import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CertificateMetadata, CertificateStatus, Question, QuestionType } from '@frontend/common'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import { Provider } from 'react-redux'
import store from '@frontend/webcert/src/store/store'
import { createCertificateMetadata } from './statusTestUtils'

const renderComponent = (certificateMetadata: CertificateMetadata, questions: Question[]) => {
  render(
    <>
      <Provider store={store}>
        <CertificateHeaderStatuses certificateMetadata={certificateMetadata} questions={questions} />
      </Provider>
    </>
  )
}

const EXPECTED_TEXT = 'Försäkringskassan har begärt komplettering'

describe('Complement status', () => {
  it('displays that FK has requested complements', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: false }]
    const certificateMetadata = createCertificateMetadata(CertificateStatus.SIGNED, true)
    renderComponent(certificateMetadata, questions)

    expect(screen.getByText(EXPECTED_TEXT)).toBeInTheDocument()
  })

  it('doesnt render anything if empty question list', () => {
    const certificateMetadata = createCertificateMetadata(CertificateStatus.SIGNED, true)
    renderComponent(certificateMetadata, [])
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if no unhandled questions', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: true }]
    const certificateMetadata = createCertificateMetadata(CertificateStatus.SIGNED, true)
    renderComponent(certificateMetadata, questions)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if wrong question types', () => {
    const questions: Question[] = [
      { type: QuestionType.CONTACT, handled: false },
      {
        type: QuestionType.COORDINATION,
        handled: false,
      },
      { type: QuestionType.OTHER, handled: false },
      { type: QuestionType.MISSING, handled: false },
    ]
    const certificateMetadata = createCertificateMetadata(CertificateStatus.SIGNED, true)
    renderComponent(certificateMetadata, questions)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if not signed', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: false }]
    const certificateMetadata = createCertificateMetadata(CertificateStatus.UNSIGNED, true)
    renderComponent(certificateMetadata, questions)

    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('should not render status if revoked', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: false }]
    const certificateMetadata = createCertificateMetadata(CertificateStatus.REVOKED, true)
    renderComponent(certificateMetadata, questions)

    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })
})
