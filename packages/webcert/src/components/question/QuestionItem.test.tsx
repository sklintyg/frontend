import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import QuestionItem from './QuestionItem'
import { Question, QuestionType } from '@frontend/common'
import userEvent from '@testing-library/user-event'
import { updateAnswerDraftSaved } from '../../store/question/questionActions'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import apiMiddleware from '../../store/api/apiMiddleware'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const history = createMemoryHistory()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const renderComponent = (question: Question) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionItem question={question} />
      </Router>
    </Provider>
  )
}

describe('QuestionItem', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiMiddleware, ...questionMiddleware),
    })
  })

  it('renders without crashing', () => {
    renderComponent(createQuestion())
  })

  it('display answer button if the question is missing and answer', () => {
    renderComponent(createQuestion())

    expect(screen.getByText('Svara')).toBeInTheDocument()
  })

  it('dont display answer button if the question has an answer', () => {
    renderComponent(addAnswerToQuestion(createQuestion(), ''))

    expect(screen.queryByText('Svara')).not.toBeInTheDocument()
  })

  describe('answering a question with default values', () => {
    it('display default value for message', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), ''))

      const message = screen.getByRole('textbox')

      expect(message).toHaveValue('')
    })

    it('send question disabled', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), ''))

      expect(screen.getByText(/Skicka/i)).toBeDisabled()
    })

    it('cancel question disabled', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), ''))

      expect(screen.getByText(/Avbryt/i)).toBeEnabled()
    })

    it('does not show message that answer draft has been saved', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), ''))

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })
  })

  describe('answering a question with user inputs', () => {
    xit('writes a message', async () => {
      jest.useFakeTimers()
      renderComponent(addAnswerToQuestion(createQuestion(), ''))
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, newMessage)

      jest.advanceTimersByTime(2000)
      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.message).toEqual(newMessage)
    })

    it('enable send when answer has value', async () => {
      renderComponent(addAnswerToQuestion(createQuestion(), 'Det här är mitt svar!'))

      expect(screen.getByText(/Skicka/i)).toBeEnabled()
    })

    it('does show message that answer has been saved', () => {
      const question = createQuestion()
      testStore.dispatch(updateAnswerDraftSaved({ questionId: question.id, isAnswerDraftSaved: true }))
      renderComponent(addAnswerToQuestion(question, 'Det här är mitt svar!'))

      expect(screen.getByText('Utkast sparat')).toBeInTheDocument()
    })

    it('hides message that answer has been saved if the user starts edit', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), 'Det här är mitt svar!'))

      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, 'Nu ändrar jag mitt svar')

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })

    it('shall delete answer when delete is confirmed', async () => {
      renderComponent(addAnswerToQuestion(createQuestion(), 'Det här är mitt svar!'))

      userEvent.click(screen.getByText('Avbryt'))
      userEvent.click(screen.getByText('Ja, radera'))

      await flushPromises()
      expect(fakeAxios.history.delete.length).not.toBe(0)
    })

    it('shall not delete answer when delete is confirmed', async () => {
      renderComponent(addAnswerToQuestion(createQuestion(), 'Det här är mitt svar!'))

      userEvent.click(screen.getByText('Avbryt'))
      userEvent.click(screen.getAllByText('Avbryt')[1])

      await flushPromises()
      expect(fakeAxios.history.delete.length).toBe(0)
    })
  })
})

const addAnswerToQuestion = (question: Question, message: string): Question => {
  return {
    ...question,
    answer: { author: '', id: '', message, sent: '' },
  } as Question
}

const createQuestion = (): Question => {
  return {
    type: QuestionType.COORDINATION,
    author: 'author',
    id: 'id',
    isForwarded: true,
    isHandled: false,
    lastUpdate: '2021-07-08',
    message: 'message',
    sent: '2021-07-08',
    subject: 'subject',
  }
}
