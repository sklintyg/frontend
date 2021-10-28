import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import QuestionItem from './QuestionItem'
import { Complement, Question, QuestionType, ResourceLinkType } from '@frontend/common'
import userEvent from '@testing-library/user-event'
import { gotoComplement, updateAnswerDraftSaved } from '../../store/question/questionActions'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import apiMiddleware from '../../store/api/apiMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../store/test/dispatchHelperMiddleware'

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
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, ...questionMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    renderComponent(createQuestion())
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
      if (question.answer) {
        expect(screen.getByText(question.answer.author)).toBeInTheDocument()
      }
    })

    it('displays message of the answer', () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar')
      renderComponent(question)

      expect(question.answer).toBeTruthy()
      if (question.answer) {
        expect(screen.getByText(question.answer.message)).toBeInTheDocument()
      }
    })

    it('displays sent of the answer', () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar')
      renderComponent(question)

      expect(question.answer).toBeTruthy()
      if (question.answer) {
        expect(screen.getByText(question.answer.sent, { exact: false })).toBeInTheDocument()
      }
    })

    it('displays subject of the answer', () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar')
      renderComponent(question)

      expect(question.answer).toBeTruthy()
      if (question.answer) {
        expect(screen.getByText('Re: ' + question.subject)).toBeInTheDocument()
      }
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

      expect(screen.getByText(/Avbryt/i)).toBeEnabled()
    })

    it('does not show message that answer draft has been saved', () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), ''))

      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })
  })

  describe('answering a question with user inputs', () => {
    xit('writes a message', () => {
      jest.useFakeTimers('modern')
      renderComponent(addAnswerDraftToQuestion(createQuestion(), ''))
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, newMessage)

      flushPromises()
      jest.advanceTimersByTime(10000)
      expect(testStore.getState().ui.uiQuestion.questionDraft.message).toEqual(newMessage)
    })

    it('enable send when answer has value', async () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      expect(screen.getByText(/Skicka/i)).toBeEnabled()
    })

    it('does show message that answer has been saved', () => {
      const question = createQuestion()
      testStore.dispatch(updateAnswerDraftSaved({ questionId: question.id, isAnswerDraftSaved: true }))
      renderComponent(addAnswerDraftToQuestion(question, 'Det här är mitt svar!'))

      expect(screen.getByText('Utkast sparat')).toBeInTheDocument()
    })

    it('hides message that answer has been saved if the user starts edit', () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, 'Nu ändrar jag mitt svar')
      expect(screen.queryByText('Utkast sparat')).not.toBeInTheDocument()
    })

    it('shall delete answer when delete is confirmed', async () => {
      jest.useRealTimers()
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      userEvent.click(screen.getByText('Avbryt'))
      userEvent.click(screen.getByText('Ja, radera'))

      await flushPromises()
      expect(fakeAxios.history.delete.length).not.toBe(0)
    })

    it('shall not delete answer when delete is cancelled', () => {
      renderComponent(addAnswerDraftToQuestion(createQuestion(), 'Det här är mitt svar!'))

      userEvent.click(screen.getByText('Avbryt'))
      userEvent.click(screen.getAllByText('Avbryt')[1])

      flushPromises()
      expect(fakeAxios.history.delete.length).toBe(0)
    })
  })

  describe('question is handled or unhandled', () => {
    afterEach(() => {
      clearDispatchedActions()
    })

    it('display checkbox when question has resource link handled', () => {
      renderComponent(createQuestion())

      expect(screen.getByText('Hanterad')).toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).toBeInTheDocument()
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

      expect(screen.queryByText('Hanterad')).toBeInTheDocument()
    })

    it('dont display as handled when question missing resource link handled and is unhandled', () => {
      const question = createQuestion()
      question.links = []
      renderComponent(question)

      expect(screen.queryByText('Hanterad')).not.toBeInTheDocument()
    })

    it('shall set as handle if checkbox selected', async () => {
      jest.useRealTimers()
      renderComponent(createQuestion())

      userEvent.click(screen.getByText('Hanterad'))

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].data).toBe('{"handled":true}')
    })

    it('shall set as unhandled if checkbox deselected', async () => {
      jest.useRealTimers()
      const question = createQuestion()
      question.handled = true
      renderComponent(question)

      userEvent.click(screen.getByText('Hanterad'))

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(1)
      expect(fakeAxios.history.post[0].data).toBe('{"handled":false}')
    })

    it('shall set as handled when handle is confirmed', async () => {
      jest.useRealTimers()
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

      userEvent.click(screen.getByText('Hanterad'))
      userEvent.click(screen.getAllByText('Markera som hanterad')[1])

      await flushPromises()
      expect(fakeAxios.history.post.length).not.toBe(0)
    })

    it('shall not set as handled when handle is cancelled', () => {
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

      userEvent.click(screen.getByText('Hanterad'))
      userEvent.click(screen.getByText('Avbryt'))

      flushPromises()
      expect(fakeAxios.history.post.length).toBe(0)
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
    beforeEach(() => {
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
    })

    it('display complement title', () => {
      expect(screen.getByText(/Visa kompletteringsbegäran för:/i)).toBeInTheDocument()
    })

    it('display complement question', () => {
      expect(screen.getByText(/questionText/i)).toBeInTheDocument()
    })

    it('goto question if complement clicked', () => {
      userEvent.click(screen.getByText(/questionText/i))

      flushPromises()
      const updateComplementsAction = dispatchedActions.find((action) => gotoComplement.match(action))
      expect(updateComplementsAction?.payload).toEqual({ questionId: 'questionId', valueId: 'valueId' })
    })
  })
})

const addAnswerDraftToQuestion = (question: Question, message: string): Question => {
  return {
    ...question,
    answer: { author: '', id: '', message, sent: '' },
  } as Question
}

const addAnswerToQuestion = (question: Question, message: string): Question => {
  return {
    ...question,
    answer: { author: 'answerAuthor', id: 'answerId', message, sent: '2021-07-16' },
  } as Question
}

const addReminderToQuestion = (question: Question, message: string): Question => {
  return {
    ...question,
    reminders: [{ author: 'Försäkringskassan', id: 'reminderId', message, sent: '2021-07-16' }],
  } as Question
}

const handleQuestion = (question: Question): Question => {
  return {
    ...question,
    handled: true,
  } as Question
}

const addComplementsToQuestion = (question: Question, complements: Complement[]): Question => {
  return {
    ...question,
    type: QuestionType.COMPLEMENT,
    complements: [...complements],
  } as Question
}

const addLastDateToReplyToQuestion = (question: Question, lastDateToReply: string): Question => {
  return {
    ...question,
    lastDateToReply: lastDateToReply,
  }
}

const createQuestion = (): Question => {
  return {
    type: QuestionType.COORDINATION,
    author: 'author',
    id: 'id',
    forwarded: true,
    handled: false,
    lastUpdate: '2021-07-08',
    message: 'message',
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
  }
}
