import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CertificateMetadata, CertificateStatus, Question, QuestionType } from '@frontend/common'
import ComplementStatus from './ComplementStatus'

const renderComponent = (certificateMetadata: CertificateMetadata, questions: Question[]) => {
  render(<ComplementStatus certificateMetadata={certificateMetadata} questions={questions} />)
}

const EXPECTED_TEXT = 'Försäkringskassan har begärt komplettering'

describe('Complement status', () => {
  it('displays that FK has requested complements', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: false }]
    const certificateMetadata = createCertificateMetadata(CertificateStatus.SIGNED)
    renderComponent(certificateMetadata, questions)

    expect(screen.getByText(EXPECTED_TEXT)).toBeInTheDocument()
  })

  it('doesnt render anything if empty question list', () => {
    const certificateMetadata = createCertificateMetadata(CertificateStatus.SIGNED)
    renderComponent(certificateMetadata, [])
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if no unhandled questions', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: true }]
    const certificateMetadata = createCertificateMetadata(CertificateStatus.SIGNED)
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
    const certificateMetadata = createCertificateMetadata(CertificateStatus.SIGNED)
    renderComponent(certificateMetadata, questions)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if not signed', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: false }]
    const certificateMetadata = createCertificateMetadata(CertificateStatus.UNSIGNED)
    renderComponent(certificateMetadata, questions)

    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })
})

const createCertificateMetadata = (status: CertificateStatus): CertificateMetadata => {
  return {
    status: status,
    type: 'lisjp',
  }
}
