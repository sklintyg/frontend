import { render, screen, within } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import QuestionPanel from './QuestionPanel'
import { updateCreateQuestionsAvailable, updateQuestions } from '../../store/question/questionActions'
import { Question, QuestionType } from '@frontend/common'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionPanel tabIndex={0} selectedTabIndex={0} minimizeSidePanel={<></>} />
      </Router>
    </Provider>
  )
}

describe('QuestionPanel', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(...questionMiddleware),
    })
  })

  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('displays header for administrative questions', () => {
    renderDefaultComponent()
    expect(screen.getByText('Administrativa frågor')).toBeInTheDocument()
  })

  it('displays text when there are no questions', () => {
    renderDefaultComponent()
    expect(screen.getByText('Det finns inga administrativa frågor för detta intyg.')).toBeInTheDocument()
  })

  it('displays number of questions in the header', () => {
    testStore.dispatch(updateQuestions([createQuestion(), createQuestion()]))
    renderDefaultComponent()

    const component = screen.getByText('Administrativa frågor')
    const numberOfQuestions = within(component).getByText('2')
    expect(numberOfQuestions).toBeInTheDocument()
  })

  it('displays no number of questions in the header', () => {
    renderDefaultComponent()

    const component = screen.getByText('Administrativa frågor')
    const numberOfQuestions = within(component).queryByText('0')
    expect(numberOfQuestions).not.toBeInTheDocument()
  })

  describe('renders a question', () => {
    const expectedQuestion = createQuestion()

    beforeEach(() => {
      testStore.dispatch(updateQuestions([expectedQuestion]))
      renderDefaultComponent()
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
    testStore.dispatch(updateCreateQuestionsAvailable(true))
    renderDefaultComponent()
    expect(screen.getByText('Här kan du ställa en ny fråga till Försäkringskassan.')).toBeInTheDocument()
  })

  it('do not displays form to create new questions', () => {
    testStore.dispatch(updateCreateQuestionsAvailable(false))
    renderDefaultComponent()
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
    subject: 'subject',
    type: QuestionType.COORDINATION,
    links: [],
  }
}
