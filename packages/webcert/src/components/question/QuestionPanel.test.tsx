import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import QuestionPanel from './QuestionPanel'
import { updateQuestions } from '../../store/question/questionActions'
import { Question } from '@frontend/common'

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
      expect(screen.getByText(expectedQuestion.sent)).toBeInTheDocument()
    })

    it('displays subject', () => {
      expect(screen.getByText(expectedQuestion.subject)).toBeInTheDocument()
    })
  })
})

function createQuestion(): Question {
  return {
    author: 'author',
    id: 'id',
    isForwarded: true,
    isHandled: true,
    lastUpdate: '2021-07-08',
    message: 'message',
    sent: '2021-07-08',
    subject: 'subject',
  }
}
