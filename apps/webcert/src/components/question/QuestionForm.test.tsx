import { Question, QuestionType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
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
import { generateFunctionDisabler } from '../../utils/functionDisablerUtils'
import QuestionForm from './QuestionForm'

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
      await act(() => userEvent.selectOptions(combobox, QuestionType.CONTACT))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.type).toEqual(QuestionType.CONTACT)
    })

    it('deselect a question type', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      renderComponent()

      const combobox = screen.getByRole('combobox')
      await act(() => userEvent.selectOptions(combobox, QuestionType.MISSING))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft.type).toEqual(QuestionType.MISSING)
    })

    it('writes a message', () => {
      vi.useFakeTimers()
      renderComponent()
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, newMessage)

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

    it.skip('disable send and cancel when question draft has value and has not been saved', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(false))
      renderComponent()
      expect(screen.getByText(/Skicka/i)).toBeDisabled()
      expect(screen.getByText(/Avbryt/i)).toBeDisabled()
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
      expect(screen.getByText(/Skicka/i).closest('button')).toBeDisabled()
      expect(screen.getByText(/Avbryt/i).closest('button')).toBeDisabled()
    })

    it('disable send and cancel when question draft is being saved', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(saveQuestion(questionDraft))
      renderComponent()
      expect(screen.getByText(/Skicka/i).closest('button')).toBeDisabled()
      expect(screen.getByText(/Avbryt/i).closest('button')).toBeDisabled()
    })

    it('disable send and cancel when question draft is being created', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(createQuestion(questionDraft))
      renderComponent()
      expect(screen.getByText(/Skicka/i).closest('button')).toBeDisabled()
      expect(screen.getByText(/Avbryt/i).closest('button')).toBeDisabled()
    })

    it('disable send and cancel when question draft is being deleted', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(deleteQuestion(questionDraft))
      renderComponent()
      expect(screen.getByText(/Skicka/i).closest('button')).toBeDisabled()
      expect(screen.getByText(/Avbryt/i).closest('button')).toBeDisabled()
    })

    it('enable send and cancel when question draft is NOT being sent', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(true))
      testStore.dispatch(updateSendingQuestion(false))
      renderComponent()
      expect(screen.getByText(/Skicka/i).closest('button')).toBeEnabled()
      expect(screen.getByText(/Avbryt/i).closest('button')).toBeEnabled()
    })

    it('does show message that question draft has been saved', () => {
      renderComponent()
      act(() => testStore.dispatch(updateQuestionDraftSaved(true)))
      expect(screen.getByText('Utkast sparat')).toBeInTheDocument()
    })

    it('hides message that question draft has been saved if the user starts edit', async () => {
      await act(() => testStore.dispatch(updateQuestionDraftSaved(true)))
      renderComponent()

      const messageField = screen.getByRole('textbox')
      await act(() => userEvent.type(messageField, 'Det här är ett meddelande'))

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })

    it('show missing type when trying to send question with missing type', async () => {
      const questionDraft = {
        ...testStore.getState().ui.uiQuestion.questionDraft,
        message: 'Skriver lite text',
      }
      await act(() => testStore.dispatch(validateQuestion(questionDraft)))
      await act(() => testStore.dispatch(updateQuestionDraftSaved(true)))
      renderComponent(questionDraft)

      await act(() => userEvent.click(screen.getByText('Skicka')))

      expect(screen.getByText('Ange en rubrik för att kunna skicka frågan.')).toBeInTheDocument()
      expect(screen.queryByText('Skriv ett meddelande för att kunna skicka frågan.')).not.toBeInTheDocument()
    })

    it('show missing message when trying to send question with missing message', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      await act(() => testStore.dispatch(validateQuestion(questionDraft)))
      await act(() => testStore.dispatch(updateQuestionDraftSaved(true)))
      renderComponent(questionDraft)

      await act(() => userEvent.click(screen.getByText('Skicka')))
      expect(screen.getByText('Skriv ett meddelande för att kunna skicka frågan.')).toBeInTheDocument()
      expect(screen.queryByText('Ange en rubrik för att kunna skicka frågan.')).not.toBeInTheDocument()
    })

    it('shall delete question draft when delete is confirmed', async () => {
      vi.useRealTimers()
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      renderComponent(questionDraft)
      await act(() => testStore.dispatch(updateQuestionDraftSaved(true)))

      await act(() => userEvent.click(screen.getByText('Avbryt')))
      await act(() => userEvent.click(screen.getByText('Ja, radera')))

      await flushPromises()
      expect(fakeAxios.history.delete.length).not.toBe(0)
    })

    it('shall not delete question draft when delete is confirmed', () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      renderComponent(questionDraft)
      testStore.dispatch(updateQuestionDraftSaved(true))

      userEvent.click(screen.getByText('Avbryt'))
      userEvent.click(screen.getAllByText('Avbryt')[1])

      flushPromises()
      expect(fakeAxios.history.delete.length).toBe(0)
    })
  })
})
