import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Question, QuestionType } from '@frontend/common'
import ComplementStatus from './ComplementStatus'

const renderComponent = (questions: Question[]) => {
  render(<ComplementStatus questions={questions} />)
}

const EXPECTED_TEXT = 'Försäkringskassan har begärt komplettering'

describe('Complement status', () => {
  it('displays that FK has requested complements', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: false }]
    renderComponent(questions)

    expect(screen.getByText(EXPECTED_TEXT)).toBeInTheDocument()
  })

  it('doesnt render anything if empty question list', () => {
    renderComponent([])
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })

  it('doesnt render anything if no unhandled questions', () => {
    const questions: Question[] = [{ type: QuestionType.COMPLEMENT, handled: true }]
    renderComponent(questions)
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
    renderComponent(questions)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })
})
