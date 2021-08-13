import { render, screen, within } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import QuestionPanel from './QuestionPanel'
import { updateQuestions } from '../../store/question/questionActions'
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

  it('displays header for complement questions', () => {
    renderDefaultComponent()
    expect(screen.getByText('Kompletteringsbegäran')).toBeInTheDocument()
  })

  it('displays number of questions in the complement questions header', () => {
    testStore.dispatch(updateQuestions([addComplementsToQuestion(createQuestion()), addComplementsToQuestion(createQuestion())]))
    renderDefaultComponent()

    const component = screen.getByText('Kompletteringsbegäran')
    const numberOfQuestions = within(component).getByText('2')
    expect(numberOfQuestions).toBeInTheDocument()
  })

  it('displays no number of questions in the complement questions header', () => {
    renderDefaultComponent()

    const component = screen.getByText('Kompletteringsbegäran')
    const numberOfQuestions = within(component).queryByText('0')
    expect(numberOfQuestions).not.toBeInTheDocument()
  })

  it('displays number of questions in the administrative questions header', () => {
    renderDefaultComponent()
    expect(screen.getByText('Administrativa frågor')).toBeInTheDocument()
  })

  it('displays number of questions in the administrative questions header', () => {
    testStore.dispatch(updateQuestions([createQuestion(), createQuestion()]))
    renderDefaultComponent()

    const component = screen.getByText('Administrativa frågor')
    const numberOfQuestions = within(component).getByText('2')
    expect(numberOfQuestions).toBeInTheDocument()
  })

  it('displays no number of questions in the administrative questions header', () => {
    renderDefaultComponent()

    const component = screen.getByText('Administrativa frågor')
    const numberOfQuestions = within(component).queryByText('0')
    expect(numberOfQuestions).not.toBeInTheDocument()
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

const addComplementsToQuestion = (question: Question): Question => {
  return {
    ...question,
    type: QuestionType.COMPLEMENT,
    complements: [{ questionId: 'questionId', valueId: 'valueId', questionText: 'questionText', message: 'complementMessage' }],
  } as Question
}
