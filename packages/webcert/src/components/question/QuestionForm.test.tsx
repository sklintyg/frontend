import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { updateQuestionDraft, updateQuestionDraftSaved, validateQuestion } from '../../store/question/questionActions'
import apiMiddleware from '../../store/api/apiMiddleware'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import QuestionForm from './QuestionForm'
import userEvent from '@testing-library/user-event'
import { Question, QuestionType } from '@frontend/common/src'

let testStore: EnhancedStore
let fakeAxios: MockAdapter

const history = createMemoryHistory()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const renderComponent = (questionDraft?: Question) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionForm questionDraft={questionDraft ? questionDraft : testStore.getState().ui.uiQuestion.questionDraft} />
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
      userEvent.selectOptions(combobox, QuestionType.MISSING)

      flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.type).toEqual(QuestionType.MISSING)
    })

    it('writes a message', () => {
      jest.useFakeTimers('modern')
      renderComponent()
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, newMessage)

      jest.advanceTimersByTime(2000)
      flushPromises()
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

    it('hides message that question draft has been saved if the user starts edit', () => {
      testStore.dispatch(updateQuestionDraftSaved(true))
      renderComponent()

      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, 'Det här är ett meddelande')

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })

    it('show missing type when trying to send question with missing type', () => {
      const questionDraft = {
        ...testStore.getState().ui.uiQuestion.questionDraft,
        message: 'Skriver lite text',
      }
      testStore.dispatch(validateQuestion(questionDraft))
      renderComponent(questionDraft)

      userEvent.click(screen.getByText('Skicka'))

      expect(screen.getByText('Ange en rubrik för att kunna skicka frågan.')).toBeInTheDocument()
      expect(screen.queryByText('Skriv ett meddelande för att kunna skicka frågan.')).not.toBeInTheDocument()
    })

    it('show missing message when trying to send question with missing message', () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(validateQuestion(questionDraft))
      renderComponent(questionDraft)

      userEvent.click(screen.getByText('Skicka'))
      expect(screen.getByText('Skriv ett meddelande för att kunna skicka frågan.')).toBeInTheDocument()
      expect(screen.queryByText('Ange en rubrik för att kunna skicka frågan.')).not.toBeInTheDocument()
    })

    it('shall delete question draft when delete is confirmed', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      renderComponent(questionDraft)

      userEvent.click(screen.getByText('Avbryt'))
      userEvent.click(screen.getByText('Ja, radera'))

      await flushPromises()
      expect(fakeAxios.history.delete.length).not.toBe(0)
    })

    it('shall not delete question draft when delete is confirmed', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      renderComponent(questionDraft)

      userEvent.click(screen.getByText('Avbryt'))
      userEvent.click(screen.getAllByText('Avbryt')[1])

      await flushPromises()
      expect(fakeAxios.history.delete.length).toBe(0)
    })
  })
})
