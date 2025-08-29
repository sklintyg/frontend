import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { fakeCertificate, fakeCertificateMetaData } from '../../faker'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { addRequest, removeRequest } from '../../store/api/requestSlice'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import {
  createQuestion,
  deleteQuestion,
  getQuestionsError,
  getQuestionsStarted,
  getQuestionsSuccess,
  saveQuestion,
  toggleQuestionFunctionDisabler,
  updateQuestionDraft,
  updateQuestionDraftSaved,
  updateSendingQuestion,
  validateQuestion,
} from '../../store/question/questionActions'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import type { Question } from '../../types'
import { QuestionType } from '../../types'
import { flushPromises } from '../../utils/flushPromises'
import QuestionForm from './QuestionForm'

let testStore: EnhancedStore
let fakeAxios: MockAdapter

const renderComponent = (questionDraft?: Question) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <QuestionForm questionDraft={questionDraft || testStore.getState().ui.uiQuestion.questionDraft} />
      </MemoryRouter>
    </Provider>
  )
}

describe('QuestionForm', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([apiMiddleware, questionMiddleware, certificateMiddleware])
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
      const option = screen.getByRole('option', { name: 'Välj typ av fråga' }) as HTMLOptionElement
      expect(option.selected).toBe(true)
    })

    it('display default value for message', async () => {
      renderComponent()
      const message = screen.getByRole('textbox')
      await expect(message).toHaveValue('')
    })

    it('send question disabled', async () => {
      renderComponent()
      await expect(screen.getByText(/Skicka/i)).toBeDisabled()
    })

    it('cancel question disabled', async () => {
      renderComponent()
      await expect(screen.getByText(/Avbryt/i)).toBeDisabled()
    })

    it('does not show message that question draft has been saved', () => {
      renderComponent()
      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })

    it('should display options available in metadata', async () => {
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({ metadata: fakeCertificateMetaData({ messageTypes: [{ type: QuestionType.CONTACT, subject: 'Kontakt' }] }) })
        )
      )
      renderComponent()
      expect(screen.queryByRole('option', { name: 'Välj typ av fråga' })).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Avstämningsmöte' })).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Övrigt' })).not.toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Kontakt' })).toBeInTheDocument()
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
      await expect(screen.getByText(/Skicka/i)).toBeEnabled()
      await expect(screen.getByText(/Avbryt/i)).toBeEnabled()
    })

    it('disable send and cancel when question functionDisabler exists', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(true))
      testStore.dispatch(
        addRequest({
          id: '1',
          url: '/api/question/1',
          method: 'GET',
          onStart: getQuestionsStarted.type,
          onSuccess: getQuestionsSuccess.type,
          onError: getQuestionsError.type,
          functionDisablerType: toggleQuestionFunctionDisabler.type,
        })
      )
      renderComponent()

      await expect(screen.getByText(/Skicka/i)).toBeDisabled()
      await expect(screen.getByText(/Avbryt/i)).toBeDisabled()
      testStore.dispatch(removeRequest('1'))
    })

    it('disable send and cancel when question draft has no values', async () => {
      renderComponent()
      await expect(screen.getByRole('button', { name: 'Skicka' })).toBeDisabled()
      await expect(screen.getByRole('button', { name: 'Avbryt' })).toBeDisabled()
    })

    it('disable send and cancel when question draft is being saved', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(saveQuestion(questionDraft))
      renderComponent()
      await expect(screen.getByRole('button', { name: 'Skicka' })).toBeDisabled()
      await expect(screen.getByRole('button', { name: 'Avbryt' })).toBeDisabled()
    })

    it('disable send and cancel when question draft is being created', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(createQuestion(questionDraft))
      renderComponent()
      await expect(screen.getByRole('button', { name: 'Skicka' })).toBeDisabled()
      await expect(screen.getByRole('button', { name: 'Avbryt' })).toBeDisabled()
    })

    it('disable send and cancel when question draft is being deleted', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(deleteQuestion(questionDraft))
      renderComponent()
      await expect(screen.getByRole('button', { name: 'Skicka' })).toBeDisabled()
      await expect(screen.getByRole('button', { name: 'Avbryt' })).toBeDisabled()
    })

    it('enable send and cancel when question draft is NOT being sent', async () => {
      const questionDraft = { ...testStore.getState().ui.uiQuestion.questionDraft, type: QuestionType.CONTACT }
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(updateQuestionDraftSaved(true))
      testStore.dispatch(updateSendingQuestion(false))
      renderComponent()
      await expect(screen.getByRole('button', { name: 'Skicka' })).toBeEnabled()
      await expect(screen.getByRole('button', { name: 'Avbryt' })).toBeEnabled()
    })

    it('does show message that question draft has been saved', () => {
      testStore.dispatch(updateQuestionDraftSaved(true))
      renderComponent()
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
