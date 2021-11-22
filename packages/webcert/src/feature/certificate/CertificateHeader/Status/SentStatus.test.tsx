import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import SentStatus from './SentStatus'
import {
  CertificateEvent,
  CertificateEventType,
  CertificateMetadata,
  CertificateRelation,
  CertificateStatus,
} from '../../../../../../common/src/types/certificate'
import { Question, QuestionType } from '@frontend/common'

const EXPECTED_TEXT = 'Intyget är skickat till'

const renderComponent = (certificateMetadata: CertificateMetadata, questions: Question[], historyEntries: CertificateEvent[]) => {
  render(<SentStatus certificateMetadata={certificateMetadata} questions={questions} historyEntries={historyEntries} />)
}

describe('Sent status', () => {
  it('displays that the certificate is sent if signed, sent, not replaced, has no unhandled complement questions and is not complemented', () => {
    const certificateMetadata = createMetadata(CertificateStatus.SIGNED, [], true)
    const questions = createQuestions(true)
    renderComponent(certificateMetadata, questions, [])
    expect(screen.getByText(EXPECTED_TEXT, { exact: false })).toBeInTheDocument()
  })

  it('doesnt render anything if missing data', () => {
    renderComponent(undefined, undefined, undefined)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate is not sent', () => {
    const certificateMetadata = createMetadata(CertificateStatus.SIGNED, [], false)
    const questions = createQuestions(false)
    renderComponent(certificateMetadata, questions, [])
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate is not signed', () => {
    const certificateMetadata = createMetadata(CertificateStatus.UNSIGNED, [], true)
    const questions = createQuestions(false)
    renderComponent(certificateMetadata, questions, [])
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if complement question exists', () => {
    const certificateMetadata = createMetadata(CertificateStatus.SIGNED, [], true)
    const questions = createQuestions(false)
    renderComponent(certificateMetadata, questions, [])
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has been complemented by draft', () => {
    const certificateMetadata = createMetadata(CertificateStatus.SIGNED, [], true)
    const questions = createQuestions(false)
    renderComponent(certificateMetadata, questions, createEvents(false))
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if certificate has been complemented by signed draft', () => {
    const certificateMetadata = createMetadata(CertificateStatus.SIGNED, [], true)
    const questions = createQuestions(false)
    renderComponent(certificateMetadata, questions, createEvents(true))
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })
})

const createMetadata = (status: CertificateStatus, children: CertificateRelation[], sent: boolean): CertificateMetadata => {
  return {
    status: status,
    relations: { children: children },
    type: 'lisjp',
    sent: sent,
  }
}

const createQuestions = (handled: boolean): Question[] => {
  return [{ type: QuestionType.COMPLEMENT, handled: handled }]
}

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
