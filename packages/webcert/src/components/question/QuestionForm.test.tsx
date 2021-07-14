import { render, screen, within } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { updateQuestionDraft, updateQuestionDraftSaved, updateQuestions } from '../../store/question/questionActions'
import apiMiddleware from '../../store/api/apiMiddleware'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import QuestionForm from './QuestionForm'
import userEvent from '@testing-library/user-event'
import { QuestionType } from '@frontend/common/src'

let testStore: EnhancedStore
let fakeAxios: MockAdapter

const history = createMemoryHistory()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionForm questionDraft={testStore.getState().ui.uiQuestion.questionDraft} />
      </Router>
    </Provider>
  )
}

describe('QuestionForm', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiMiddleware, ...questionMiddleware),
    })
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('renders without crashing', () => {
    renderComponent()
  })

  describe('with default values', () => {
    it('display header', () => {
      renderComponent()
      expect(screen.getByText('Här kan du ställa en ny fråga till Försäkringskassan.')).toBeInTheDocument()
    })

    it('display default value for question type', () => {
      renderComponent()
      const options = screen.getAllByRole('option')
      expect(options[0].selected).toBeTruthy()
    })

    it('display default value for message', () => {
      renderComponent()
      const message = screen.getByRole('textbox')
      expect(message).toHaveValue('')
    })

    it('send question disabled', () => {
      renderComponent()
      expect(screen.getByText(/Skicka/i)).toBeDisabled()
    })

    it('cancel question disabled', () => {
      renderComponent()
      expect(screen.getByText(/Avbryt/i)).toBeDisabled()
    })

    it('does not show message that question draft has been saved', () => {
      renderComponent()
      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })
  })

  describe('with user inputs', () => {
    it('select a question type', () => {
      renderComponent()
      const combobox = screen.getByRole('combobox')
      userEvent.selectOptions(combobox, QuestionType.CONTACT)

      flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.type).toEqual(QuestionType.CONTACT)
    })

    it('deselect a question type', () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      renderComponent()

      const combobox = screen.getByRole('combobox')
      userEvent.selectOptions(combobox, QuestionType.DEFAULT)

      flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.type).toEqual(QuestionType.DEFAULT)
    })

    xit('writes a message', async () => {
      jest.useFakeTimers()
      renderComponent()
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, newMessage)

      jest.advanceTimersByTime(2000)
      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.message).toEqual(newMessage)
    })

    it('enable send and cancel when question draft has value', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      renderComponent()
      expect(screen.getByText(/Skicka/i)).toBeEnabled()
      expect(screen.getByText(/Avbryt/i)).toBeEnabled()
    })

    it('disable send and cancel when question draft has no values', async () => {
      renderComponent()
      expect(screen.getByText(/Skicka/i).closest('button')).toBeDisabled()
      expect(screen.getByText(/Avbryt/i).closest('button')).toBeDisabled()
    })

    it('does show message that question draft has been saved', () => {
      renderComponent()
      testStore.dispatch(updateQuestionDraftSaved(true))
      expect(screen.getByText('Utkast sparat')).toBeInTheDocument()
    })
  })
})
