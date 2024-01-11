import { Complement, Question, QuestionType, ResourceLinkType } from '@frontend/common'
import { AnyAction, EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { isEqual } from 'lodash'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import QuestionItem from './QuestionItem'
import { apiCallBegan } from '../../store/api/apiActions'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { gotoComplement, updateAnswerDraftSaved } from '../../store/question/questionActions'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../store/test/dispatchHelperMiddleware'

let testStore: EnhancedStore

const history = createMemoryHistory()

const setupStore = () => configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, questionMiddleware])

const actionHasSimilarPayload = (action: AnyAction | undefined, payload: unknown) => {
  if (!action || !action.payload) return false
  if (payload instanceof Object) {
    return Boolean(
      Object.entries(payload).filter(
        ([prop, val]) =>
          Object.prototype.hasOwnProperty.call(payload, prop) &&
          Object.prototype.hasOwnProperty.call(action.payload, prop) &&
          isEqual(action.payload[prop], val)
      )
    )
  }
  return true
}

const addAnswerDraftToQuestion = (question: Question, message: string): Question =>
  ({
    ...question,
    answer: { author: '', id: '', message, sent: '' },
  } as Question)

const addAnswerToQuestion = (question: Question, message: string): Question =>
  ({
    ...question,
    answer: { author: 'answerAuthor', id: 'answerId', message, sent: '2021-07-16' },
  } as Question)

const addReminderToQuestion = (question: Question, message: string): Question =>
  ({
    ...question,
    reminders: [{ author: 'Försäkringskassan', id: 'reminderId', message, sent: '2021-07-16' }],
  } as Question)

const handleQuestion = (question: Question): Question =>
  ({
    ...question,
    handled: true,
  } as Question)

const addComplementsToQuestion = (question: Question, complements: Complement[]): Question =>
  ({
    ...question,
    type: QuestionType.COMPLEMENT,
    complements: [...complements],
  } as Question)

const addLastDateToReplyToQuestion = (question: Question, lastDateToReply: string): Question => ({
  ...question,
  lastDateToReply,
})

const createComplementWithLongText = (): Question => ({
  type: QuestionType.COMPLEMENT,
  author: 'author',
  id: 'id',
  forwarded: true,
  handled: false,
  lastUpdate: '2021-07-08',
  message:
    'message message message message message message message message message' +
    'message message message message message message message message message message message ' +
    'message message message message message message message message message' +
    'message message message message message message message message message',
  sent: '2021-07-08',

  complements: [],
  subject: 'subject',
  reminders: [],
  links: [
    {
      type: ResourceLinkType.ANSWER_QUESTION,
      enabled: true,
      name: 'Svara',
      description: 'Svara på fråga',
    },
    {
      type: ResourceLinkType.HANDLE_QUESTION,
      enabled: true,
      name: 'Hantera',
      description: 'Hantera fråga',
    },
  ],
})

const createQuestionWithLongText = (): Question => ({
  type: QuestionType.COORDINATION,
  author: 'author',
  id: 'id',
  forwarded: true,
  handled: false,
  lastUpdate: '2021-07-08',
  message:
    'message message message message message message message message message' +
    'message message message message message message message message message message message ' +
    'message message message message message message message message message' +
    'message message message message message message message message message',
  sent: '2021-07-08',

  complements: [],
  subject: 'subject',
  reminders: [],
  links: [
    {
      type: ResourceLinkType.ANSWER_QUESTION,
      enabled: true,
      name: 'Svara',
      description: 'Svara på fråga',
    },
    {
      type: ResourceLinkType.HANDLE_QUESTION,
      enabled: true,
      name: 'Hantera',
      description: 'Hantera fråga',
    },
  ],
})

const createQuestion = (): Question => ({
  type: QuestionType.COORDINATION,
  author: 'author',
  id: 'id',
  forwarded: true,
  handled: false,
  lastUpdate: '2021-07-08',
  message: 'message',
  sent: '2021-07-08',

  complements: [],
  contactInfo: ['Fk kontaktinfo'],
  subject: 'subject',
  reminders: [],
  links: [
    {
      type: ResourceLinkType.ANSWER_QUESTION,
      enabled: true,
      name: 'Svara',
      description: 'Svara på fråga',
    },
    {
      type: ResourceLinkType.HANDLE_QUESTION,
      enabled: true,
      name: 'Hantera',
      description: 'Hantera fråga',
    },
  ],
})

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
    testStore = setupStore()
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    expect(() => renderComponent(createQuestion())).not.toThrow()
  })

  it('shuld show contact info', () => {
    renderComponent(createQuestion())
    expect(screen.getByText('Fk kontaktinfo')).toBeInTheDocument()
  })

  it('display answer button if the question has answer resource link', () => {
    renderComponent(createQuestion())

    expect(screen.getByText('Svara')).toBeInTheDocument()
  })

  it('display last date to reply if the question is not handled and has last date to reply string', () => {
    const expectedDate = '2021-10-25'
    const expectedText = `Svara senast: ${expectedDate}`
    renderComponent(addLastDateToReplyToQuestion(createQuestion(), expectedDate))

    expect(screen.getByText(expectedText)).toBeInTheDocument()
  })

  it('dont display last date to reply if the question is handled and only has last date to reply string', () => {
    const expectedDate = '2021-10-25'
    const expectedText = `Svara senast: ${expectedDate}`
    const question = addLastDateToReplyToQuestion(handleQuestion(createQuestion()), expectedDate)
    question.links = []
    renderComponent(question)

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument()
  })

  it('dont display last date to reply if the question is not handled but has no last date to reply string', () => {
    const expectedText = 'Svara senast:'
    renderComponent(createQuestion())

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument()
  })

  it('dont display answer button if the question is missing answer resource link', () => {
    const questionWithoutAnswerLink = createQuestion()
    questionWithoutAnswerLink.links = []
    renderComponent(questionWithoutAnswerLink)

    expect(screen.queryByText('Svara')).not.toBeInTheDocument()
  })

  it('dont display answer button if the question has an answer', () => {
    renderComponent(addAnswerDraftToQuestion(createQuestion(), ''))

    expect(screen.queryByText('Svara')).not.toBeInTheDocument()
  })

  describe('question with answer', () => {
    it('dont display answer button if the question has an answer', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), 'Det här är ett svar'))

      expect(screen.queryByText('Svara')).not.toBeInTheDocument()
    })

    it('dont display send button if the question has an answer', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), 'Det här är ett svar'))

      expect(screen.queryByText('Skicka')).not.toBeInTheDocument()
    })

    it('dont display cancel button if the question has an answer', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), 'Det här är ett svar'))

      expect(screen.queryByText('Avbryt')).not.toBeInTheDocument()
    })

    it('does show message that answer has been saved if the question has an answer', () => {
      renderComponent(addAnswerToQuestion(createQuestion(), 'Det här är ett svar'))

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })

    it('displays author of the answer', () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar')
      renderComponent(question)

      expect(question.answer).toBeTruthy()
      expect(screen.getByText(question.answer?.author ?? '')).toBeInTheDocument()
    })

    it('displays message of the answer', () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar')
      renderComponent(question)

      expect(question.answer).toBeTruthy()
      expect(screen.getByText(question.answer?.message ?? '')).toBeInTheDocument()
    })

    it('displays sent of the answer', () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar')
      renderComponent(question)

      expect(question.answer).toBeTruthy()
      expect(screen.getByText(question.answer?.sent ?? '', { exact: false })).toBeInTheDocument()
    })

    it('displays subject of the answer', () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar')
      renderComponent(question)

      expect(question.answer).toBeTruthy()
      expect(screen.getByText(`Re: ${question.subject}`)).toBeInTheDocument()
    })
  })

  describe('answering a question with default values', () => {
    it('display default value for message', () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), ''))

      const message = screen.getByRole('textbox')

      expect(message).toHaveValue('')
    })

    it('send question disabled', () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), ''))

      expect(screen.getByText(/Skicka/i)).toBeDisabled()
    })

    it('cancel question disabled', () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), ''))

      expect(screen.getByText(/Avbryt/i)).toBeDisabled()
    })

    it('does not show message that answer draft has been saved', () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), ''))

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })
  })

  describe('answering a question with user inputs', () => {
    beforeEach(() => {
      testStore = setupStore()
    })

    afterEach(() => {
      clearDispatchedActions()
    })

    it('enable send and cancel when answer has value', () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      expect(screen.getByText(/Skicka/i)).toBeEnabled()
      expect(screen.getByText(/Avbryt/i)).toBeEnabled()
    })

    it('does show message that answer has been saved', () => {
      const question = createQuestion()
      testStore.dispatch(updateAnswerDraftSaved({ questionId: question.id, isAnswerDraftSaved: true }))
      renderComponent(addAnswerDraftToQuestion(question, 'Det här är mitt svar!'))

      expect(screen.getByText('Utkast sparat')).toBeInTheDocument()
    })

    it('hides message that answer has been saved if the user starts edit', async () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      const messageField = screen.getByRole('textbox')
      await userEvent.type(messageField, 'Nu ändrar jag mitt svar')

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })

    it('shall delete answer when delete is confirmed', async () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      await userEvent.click(screen.getByText('Avbryt'))
      await userEvent.click(screen.getByText('Ja, radera'))

      const action = dispatchedActions.find((a) => a.type === apiCallBegan.type)

      expect(
        actionHasSimilarPayload(action, {
          url: '/api/question/id/answer',
          method: 'DELETE',
        })
      ).toEqual(true)
    })

    it('shall not delete answer when delete is cancelled', async () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      await userEvent.click(screen.getByText('Avbryt'))
      await userEvent.click(screen.getAllByText('Avbryt')[1])

      expect(dispatchedActions).toHaveLength(0)
    })

    it('disable send and cancel while sending answer draft', async () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      const sendButton = screen.getByText('Skicka')
      const cancelButton = screen.getByText('Avbryt')

      await userEvent.click(sendButton)

      expect(sendButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })

    it('disable send and cancel while deleting answer draft', async () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      const sendButton = screen.getByText('Skicka')
      const cancelButton = screen.getByText('Avbryt')

      await userEvent.click(cancelButton)
      await userEvent.click(screen.getByText('Ja, radera'))

      expect(sendButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })
  })

  describe('question is handled or unhandled', () => {
    beforeEach(() => {
      testStore = setupStore()
    })

    afterEach(() => {
      clearDispatchedActions()
    })

    it('display checkbox when question has resource link handled', () => {
      renderComponent(createQuestion())

      expect(screen.getByText('Hanterad')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('display checkbox as checked if handled', () => {
      const question = createQuestion()
      question.handled = true
      renderComponent(question)

      expect(screen.queryByRole('checkbox')).toBeChecked()
    })

    it('display checkbox as unchecked if unhandled', () => {
      renderComponent(createQuestion())

      expect(screen.queryByRole('checkbox')).not.toBeChecked()
    })

    it('dont display checkbox when question missing resource link handled', () => {
      const question = createQuestion()
      question.links = []
      renderComponent(question)

      expect(screen.queryByText('Hanterad')).not.toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('display as handled when question missing resource link handled but is handled', () => {
      const question = createQuestion()
      question.links = []
      question.handled = true
      renderComponent(question)

      expect(screen.getByText('Hanterad')).toBeInTheDocument()
    })

    it('dont display as handled when question missing resource link handled and is unhandled', () => {
      const question = createQuestion()
      question.links = []
      renderComponent(question)

      expect(screen.queryByText('Hanterad')).not.toBeInTheDocument()
    })

    it('shall set as handled if checkbox selected', async () => {
      renderComponent(createQuestion())

      await userEvent.click(screen.getByText('Hanterad'))

      const action = dispatchedActions.find((a) => a.type === apiCallBegan.type)

      expect(
        actionHasSimilarPayload(action, {
          url: '/api/question/id/handle',
          data: { handled: true },
        })
      ).toEqual(true)
    })

    it('shall set as unhandled if checkbox deselected', async () => {
      const question = createQuestion()
      question.handled = true
      renderComponent(question)

      await userEvent.click(screen.getByText('Hanterad'))

      const action = dispatchedActions.find((a) => a.type === apiCallBegan.type)

      expect(
        actionHasSimilarPayload(action, {
          url: '/api/question/id/handle',
          data: { handled: false },
        })
      ).toEqual(true)
    })

    it('shall set as handled when handle is confirmed', async () => {
      renderComponent(
        addComplementsToQuestion(createQuestion(), [
          {
            questionId: 'questionId',
            valueId: 'valueId',
            questionText: 'questionText',
            message: 'complementMessage',
          },
        ])
      )

      await userEvent.click(screen.getByText('Hanterad'))
      await userEvent.click(screen.getAllByText('Markera som hanterad')[1])

      const action = dispatchedActions.find((a) => a.type === apiCallBegan.type)

      expect(
        actionHasSimilarPayload(action, {
          url: '/api/question/id/handle',
          data: { handled: true },
        })
      ).toEqual(true)
    })

    it('shall not set as handled when handle is cancelled', async () => {
      renderComponent(
        addComplementsToQuestion(createQuestion(), [
          {
            questionId: 'questionId',
            valueId: 'valueId',
            questionText: 'questionText',
            message: 'complementMessage',
          },
        ])
      )

      await userEvent.click(screen.getByText('Hanterad'))
      await userEvent.click(screen.getByText('Avbryt'))

      expect(dispatchedActions).toHaveLength(0)
    })
  })

  describe('question with reminders', () => {
    it('display reminder message', () => {
      renderComponent(addReminderToQuestion(createQuestion(), 'Nu påminner vi er att svara'))

      expect(screen.getByText(/Nu påminner vi er att svara/i)).toBeInTheDocument()
    })

    it('display reminder title', () => {
      renderComponent(addReminderToQuestion(createQuestion(), 'Nu påminner vi er att svara'))

      expect(screen.getByText(/Påminnelse/i)).toBeInTheDocument()
    })

    it('display reminder date/time', () => {
      const question = addReminderToQuestion(createQuestion(), 'Nu påminner vi er att svara')
      renderComponent(question)

      expect(screen.getByText(question.reminders[0].sent, { exact: false })).toBeInTheDocument()
    })

    it('dont display reminder if the question is handled', () => {
      renderComponent(handleQuestion(addReminderToQuestion(createQuestion(), 'Nu påminner vi er att svara')))

      expect(screen.queryByText(/Påminnelse/i)).not.toBeInTheDocument()
    })
  })

  describe('question with complements', () => {
    afterEach(() => {
      clearDispatchedActions()
    })

    it('display complement title', () => {
      renderComponent(
        addComplementsToQuestion(createQuestion(), [
          {
            questionId: 'questionId',
            valueId: 'valueId',
            questionText: 'questionText',
            message: 'complementMessage',
          },
        ])
      )
      expect(screen.getByText(/Visa kompletteringsbegäran för:/i)).toBeInTheDocument()
    })

    it('display complement question', () => {
      renderComponent(
        addComplementsToQuestion(createQuestion(), [
          {
            questionId: 'questionId',
            valueId: 'valueId',
            questionText: 'questionText',
            message: 'complementMessage',
          },
        ])
      )
      expect(screen.getByText(/questionText/i)).toBeInTheDocument()
    })

    it('goto question if complement clicked', async () => {
      renderComponent(
        addComplementsToQuestion(createQuestion(), [
          {
            questionId: 'questionId',
            valueId: 'valueId',
            questionText: 'questionText',
            message: 'complementMessage',
          },
        ])
      )
      await userEvent.click(screen.getByText(/questionText/i))

      const updateComplementsAction = dispatchedActions.find((action) => gotoComplement.match(action))
      expect(updateComplementsAction?.payload).toEqual({ questionId: 'questionId', valueId: 'valueId' })
    })
  })

  describe('question message', () => {
    it('should show exapandable text for complements with message longer than limit', () => {
      renderComponent(createComplementWithLongText())
      expect(screen.getByText('Visa mer', { exact: false })).toBeInTheDocument()
    })

    it('should not show expandable text for messages that are longer than the limit but not a complement', () => {
      renderComponent(createQuestionWithLongText())
      expect(screen.queryByText('Visa mer')).not.toBeInTheDocument()
    })
  })

  describe('forwarded', () => {
    it('should show forwarded status for forwarded question', () => {
      const question = createQuestion()
      question.forwarded = true
      renderComponent(question)
      expect(screen.getByText('Vidarebefordrad')).toBeInTheDocument()
    })

    it('should not show forwarded status for not forwarded question', () => {
      const question = createQuestion()
      question.forwarded = false
      renderComponent(question)
      expect(screen.queryByText('Vidarebefordrad')).not.toBeInTheDocument()
    })
  })
})
