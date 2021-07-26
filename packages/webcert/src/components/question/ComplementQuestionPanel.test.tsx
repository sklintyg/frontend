import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { Question, QuestionType } from '@frontend/common'
import ComplementQuestionPanel from './ComplementQuestionPanel'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderComponent = (questions: Question[]) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <ComplementQuestionPanel complementQuestions={questions} />
      </Router>
    </Provider>
  )
}

describe('ComplementQuestionPanel', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(...questionMiddleware),
    })
  })

  it('renders without crashing', () => {
    renderComponent([])
  })

  it('displays text when there are no questions', () => {
    renderComponent([])
    expect(screen.getByText('Det finns ingen kompletteringsbegäran på detta intyg.')).toBeInTheDocument()
  })

  describe('renders a question', () => {
    const expectedQuestion = createQuestion()

    beforeEach(() => {
      renderComponent([expectedQuestion])
    })

    it('displays author', () => {
      expect(screen.getByText(expectedQuestion.author)).toBeInTheDocument()
    })

    it('displays message', () => {
      expect(screen.getByText(expectedQuestion.message)).toBeInTheDocument()
    })

    it('displays sent', () => {
      expect(screen.getByText(expectedQuestion.sent, { exact: false })).toBeInTheDocument()
    })

    it('displays subject', () => {
      expect(screen.getByText(expectedQuestion.subject)).toBeInTheDocument()
    })

    it('displays complement question text', () => {
      expect(screen.getByText(expectedQuestion.complements[0].questionText)).toBeInTheDocument()
    })
  })
})

function createQuestion(): Question {
  return {
    author: 'author',
    id: String(Math.random()),
    forwarded: true,
    handled: true,
    lastUpdate: '2021-07-08',
    message: 'message',
    sent: '2021-07-08',
    complements: [{ questionId: 'questionId', valueId: 'valueId', questionText: 'questionText', message: 'complementMessage' }],
    subject: 'subject',
    reminders: [],
    type: QuestionType.COORDINATION,
    links: [],
  }
}
