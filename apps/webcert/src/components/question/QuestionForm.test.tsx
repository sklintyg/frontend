import { Question, QuestionType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { expect, it, describe, vi, beforeEach, afterEach } from 'vitest'
import QuestionForm from './QuestionForm'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import {
  createQuestion,
  deleteQuestion,
  saveQuestion,
  toggleQuestionFunctionDisabler,
  updateQuestionDraft,
  updateQuestionDraftSaved,
  updateSendingQuestion,
  validateQuestion,
} from '../../store/question/questionActions'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { flushPromises } from '../../utils/flushPromises'
import { generateFunctionDisabler } from '../../utils/functionDisablerUtils'

let testStore: EnhancedStore
let fakeAxios: MockAdapter

const history = createMemoryHistory()

const renderComponent = (questionDraft?: Question) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionForm questionDraft={questionDraft || testStore.getState().ui.uiQuestion.questionDraft} />
      </Router>
    </Provider>
  )
}

describe('QuestionForm', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([apiMiddleware, questionMiddleware])
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('renders without crashing', () => {
    expect(() => renderComponent()).not.toThrow()
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
    it('select a question type', async () => {
      renderComponent()
      const combobox = screen.getByRole('combobox')
      await userEvent.selectOptions(combobox, QuestionType.CONTACT)

      flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.type).toEqual(QuestionType.CONTACT)
    })

    it('deselect a question type', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      renderComponent()

      const combobox = screen.getByRole('combobox')
      await userEvent.selectOptions(combobox, QuestionType.MISSING)

      flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.type).toEqual(QuestionType.MISSING)
    })

    it('writes a message', async () => {
      vi.useFakeTimers()
      renderComponent()
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      await userEvent.type(messageField, newMessage)

      vi.advanceTimersByTime(2000)
      flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.message).toEqual(newMessage)
    })

    it('enable send and cancel when question draft has value and has been saved', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(true))
      renderComponent()
      expect(screen.getByText(/Skicka/i)).toBeEnabled()
      expect(screen.getByText(/Avbryt/i)).toBeEnabled()
    })

    it('disable send and cancel when question functionDisabler exists', () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(true))
      const functionDisabler = generateFunctionDisabler()
      testStore.dispatch(toggleQuestionFunctionDisabler(functionDisabler))
      renderComponent()

      expect(screen.getByText(/Skicka/i)).toBeDisabled()
      expect(screen.getByText(/Avbryt/i)).toBeDisabled()
      testStore.dispatch(toggleQuestionFunctionDisabler(functionDisabler))
    })

    it('disable send and cancel when question draft has no values', async () => {
      renderComponent()
      expect(screen.getByRole('button', { name: 'Skicka' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Avbryt' })).toBeDisabled()
    })

    it('disable send and cancel when question draft is being saved', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(saveQuestion(questionDraft))
      renderComponent()
      expect(screen.getByRole('button', { name: 'Skicka' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Avbryt' })).toBeDisabled()
    })

    it('disable send and cancel when question draft is being created', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(createQuestion(questionDraft))
      renderComponent()
      expect(screen.getByRole('button', { name: 'Skicka' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Avbryt' })).toBeDisabled()
    })

    it('disable send and cancel when question draft is being deleted', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(deleteQuestion(questionDraft))
      renderComponent()
      expect(screen.getByRole('button', { name: 'Skicka' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Avbryt' })).toBeDisabled()
    })

    it('enable send and cancel when question draft is NOT being sent', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(true))
      testStore.dispatch(updateSendingQuestion(false))
      renderComponent()
      expect(screen.getByRole('button', { name: 'Skicka' })).toBeEnabled()
      expect(screen.getByRole('button', { name: 'Avbryt' })).toBeEnabled()
    })

    it('does show message that question draft has been saved', () => {
      renderComponent()
      testStore.dispatch(updateQuestionDraftSaved(true))
      expect(screen.getByText('Utkast sparat')).toBeInTheDocument()
    })

    it('hides message that question draft has been saved if the user starts edit', async () => {
      testStore.dispatch(updateQuestionDraftSaved(true))
      renderComponent()

      const messageField = screen.getByRole('textbox')
      await userEvent.type(messageField, 'Det här är ett meddelande')

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })

    it('show missing type when trying to send question with missing type', async () => {
      const questionDraft = {
        ...testStore.getState().ui.uiQuestion.questionDraft,
        message: 'Skriver lite text',
      }
      testStore.dispatch(validateQuestion(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(true))
      renderComponent(questionDraft)

      await userEvent.click(screen.getByText('Skicka'))

      expect(screen.getByText('Ange en rubrik för att kunna skicka frågan.')).toBeInTheDocument()
      expect(screen.queryByText('Skriv ett meddelande för att kunna skicka frågan.')).not.toBeInTheDocument()
    })

    it('show missing message when trying to send question with missing message', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(validateQuestion(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(true))
      renderComponent(questionDraft)

      await userEvent.click(screen.getByText('Skicka'))
      expect(screen.getByText('Skriv ett meddelande för att kunna skicka frågan.')).toBeInTheDocument()
      expect(screen.queryByText('Ange en rubrik för att kunna skicka frågan.')).not.toBeInTheDocument()
    })

    it('shall delete question draft when delete is confirmed', async () => {
      vi.useRealTimers()
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      renderComponent(questionDraft)
      testStore.dispatch(updateQuestionDraftSaved(true))

      await userEvent.click(screen.getByText('Avbryt'))
      await userEvent.click(screen.getByText('Ja, radera'))

      await flushPromises()
      expect(fakeAxios.history.delete.length).not.toBe(0)
    })

    it('shall not delete question draft when delete is confirmed', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      renderComponent(questionDraft)
      testStore.dispatch(updateQuestionDraftSaved(true))

      await userEvent.click(screen.getByText('Avbryt'))
      await userEvent.click(screen.getAllByText('Avbryt')[1])

      flushPromises()
      expect(fakeAxios.history.delete.length).toBe(0)
    })
  })
})
