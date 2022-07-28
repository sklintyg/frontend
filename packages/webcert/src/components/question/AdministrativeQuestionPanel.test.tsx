import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { Question, QuestionType } from '@frontend/common'
import AdministrativeQuestionPanel from './AdministrativeQuestionPanel'
import { updateIsLoadingQuestions } from '../../store/question/questionActions'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderDefaultComponent = (questions: Question[], isQuestionFormVisible: boolean, questionDraft: Question) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <AdministrativeQuestionPanel
          administrativeQuestions={questions}
          isQuestionFormVisible={isQuestionFormVisible}
          administrativeQuestionDraft={questionDraft}
          headerHeight={0}
        />
      </Router>
    </Provider>
  )
}

describe('QuestionPanel', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(questionMiddleware),
    })

    testStore.dispatch(updateIsLoadingQuestions(false))
  })

  it('renders without crashing', () => {
    renderDefaultComponent([], true, testStore.getState().ui.uiQuestion.questionDraft)
  })

  it('displays text when there are no questions', () => {
    renderDefaultComponent([], true, testStore.getState().ui.uiQuestion.questionDraft)
    expect(screen.getByText('Det finns inga administrativa frågor för detta intyg.')).toBeInTheDocument()
  })

  describe('renders a question', () => {
    const expectedQuestion = createQuestion()

    beforeEach(() => {
      renderDefaultComponent([expectedQuestion], true, testStore.getState().ui.uiQuestion.questionDraft)
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
  })

  it('displays form to create new questions', () => {
    renderDefaultComponent([], true, testStore.getState().ui.uiQuestion.questionDraft)
    expect(screen.getByText('Här kan du ställa en ny fråga till Försäkringskassan.')).toBeInTheDocument()
  })

  it('do not displays form to create new questions', () => {
    renderDefaultComponent([], false, testStore.getState().ui.uiQuestion.questionDraft)
    expect(screen.queryByText('Här kan du ställa en ny fråga till Försäkringskassan.')).not.toBeInTheDocument()
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
    complements: [],
    subject: 'subject',
    reminders: [],
    type: QuestionType.COORDINATION,
    links: [],
  }
}
