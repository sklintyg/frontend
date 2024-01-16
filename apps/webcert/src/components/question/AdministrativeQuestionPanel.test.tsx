import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { updateIsLoadingQuestions } from '../../store/question/questionActions'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { Question, QuestionType } from '../../types'
import AdministrativeQuestionPanel from './AdministrativeQuestionPanel'

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
        />
      </Router>
    </Provider>
  )
}

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

describe('QuestionPanel', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([questionMiddleware])

    testStore.dispatch(updateIsLoadingQuestions(false))
  })

  it('renders without crashing', () => {
    expect(() => renderDefaultComponent([], true, testStore.getState().ui.uiQuestion.questionDraft)).not.toThrow()
  })

  it('displays text when there are no questions', () => {
    renderDefaultComponent([], true, testStore.getState().ui.uiQuestion.questionDraft)
    expect(screen.getByText('Det finns inga administrativa frågor för detta intyg.')).toBeInTheDocument()
  })

  describe('renders a question', () => {
    const expectedQuestion = createQuestion()

    it('displays author', () => {
      renderDefaultComponent([expectedQuestion], true, testStore.getState().ui.uiQuestion.questionDraft)
      expect(screen.getByText(expectedQuestion.author)).toBeInTheDocument()
    })

    it('displays message', () => {
      renderDefaultComponent([expectedQuestion], true, testStore.getState().ui.uiQuestion.questionDraft)
      expect(screen.getByText(expectedQuestion.message)).toBeInTheDocument()
    })

    it('displays sent', () => {
      renderDefaultComponent([expectedQuestion], true, testStore.getState().ui.uiQuestion.questionDraft)
      expect(screen.getByText(expectedQuestion.sent, { exact: false })).toBeInTheDocument()
    })

    it('displays subject', () => {
      renderDefaultComponent([expectedQuestion], true, testStore.getState().ui.uiQuestion.questionDraft)
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
