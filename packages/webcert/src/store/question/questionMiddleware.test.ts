import MockAdapter from 'axios-mock-adapter'
import { Answer, Certificate, Question, QuestionType, ResourceLinkType } from '@frontend/common'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import { questionMiddleware } from './questionMiddleware'
import { updateCertificate } from '../certificate/certificateActions'
import {
  createAnswer,
  deleteAnswer,
  deleteQuestion,
  editAnswer,
  editQuestion,
  getQuestions,
  QuestionResponse,
  QuestionsResponse,
  sendAnswer,
  sendQuestion,
  updateCreateQuestionsAvailable,
  updateQuestionDraft,
  updateQuestions,
  validateQuestion,
} from './questionActions'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test question middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiMiddleware, ...questionMiddleware),
    })
  })

  describe('Handle GetQuestions', () => {
    it('shall handle get questions', async () => {
      const expectedQuestion = createQuestion()
      const getQuestionResponse = { questions: [expectedQuestion] } as QuestionsResponse
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
    })

    it('shall handle get questions with question draft', async () => {
      const expectedQuestion = createQuestionDraft()
      const getQuestionResponse = { questions: [expectedQuestion] } as QuestionsResponse
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCreateQuestionsAvailable(true))
      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).toEqual(expectedQuestion)
      expect(testStore.getState().ui.uiQuestion.questions).toHaveLength(0)
      expect(testStore.getState().ui.uiQuestion.isQuestionDraftSaved).toBeTruthy()
    })

    it('shall handle get questions with question draft when create question not available', async () => {
      const expectedQuestion = createQuestionDraft()
      const getQuestionResponse = { questions: [expectedQuestion] } as QuestionsResponse
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCreateQuestionsAvailable(false))
      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(expectedQuestion)
      expect(testStore.getState().ui.uiQuestion.questions).toHaveLength(0)
    })

    it('shall handle get questions without question draft', async () => {
      const getQuestionResponse = { questions: [] } as QuestionsResponse
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)
      const questionDraft = createQuestionDraft()

      testStore.dispatch(updateCreateQuestionsAvailable(true))
      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(questionDraft)
      expect(testStore.getState().ui.uiQuestion.isQuestionDraftSaved).toBeFalsy()
    })
  })

  describe('Handle UpdateCertificate', () => {
    it('shall get questions when certificate is updated', async () => {
      const expectedQuestion = createQuestion()
      const getQuestionResponse = { questions: [expectedQuestion] } as QuestionsResponse
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCertificate(getCertificate('certificateId', true)))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
    })

    it('shall not get questions when resource link is missing', async () => {
      const expectedQuestion = createQuestion()
      const getQuestionResponse = { questions: [expectedQuestion] } as QuestionsResponse
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCertificate(getCertificate('certificateId', false)))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions).toHaveLength(0)
    })

    it('shall clear state when certificate is updated', async () => {
      const initialState = { ...testStore.getState().ui.uiQuestion }
      const questionDraft = createQuestionDraft()
      testStore.dispatch(updateQuestionDraft(questionDraft))

      testStore.dispatch(updateCertificate(getCertificate('certificateId', false)))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion).toEqual(initialState)
    })

    it('shall set certificateId when certificate is updated', async () => {
      const getQuestionResponse = { questions: [] } as QuestionsResponse
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCertificate(getCertificate('certificateId', true)))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.certificateId).toEqual('certificateId')
    })

    it('shall set isCreateQuestionsAvailable when certificate is updated', async () => {
      const getQuestionResponse = { questions: [] } as QuestionsResponse
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCertificate(getCertificate('certificateId', true)))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isCreateQuestionsAvailable).toBeTruthy()
    })
  })

  describe('Handle DeleteQuestion', () => {
    it('shall handle delete question', async () => {
      const questionDraft = createQuestionDraft()
      testStore.dispatch(updateQuestionDraft(questionDraft))
      fakeAxios.onDelete('/api/question/' + questionDraft.id).reply(200)

      testStore.dispatch(deleteQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(questionDraft)
    })
  })

  describe('Handle Edit', () => {
    it('shall handle save question', async () => {
      const questionDraft = createQuestionDraft()
      testStore.dispatch(updateQuestionDraft(questionDraft))
      fakeAxios.onPost('/api/question/' + questionDraft.id).reply(200)

      const editedDraft = { ...questionDraft, message: 'new message' }
      testStore.dispatch(editQuestion(editedDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).toEqual(editedDraft)
      expect(fakeAxios.history.post.length).toBe(1)
    })

    it('shall handle create question', async () => {
      const questionDraft = createQuestionDraft()
      const expectedQuestion = createQuestion()
      const createQuestionResponse = { question: expectedQuestion } as QuestionResponse
      questionDraft.id = ''
      testStore.dispatch(updateQuestionDraft(questionDraft))
      fakeAxios.onPost('/api/question').reply(200, createQuestionResponse)

      testStore.dispatch(editQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).toEqual(expectedQuestion)
    })

    it('shall set isQuestionDraftSaved when question has been saved', async () => {
      const questionDraft = createQuestionDraft()
      fakeAxios.onPost('/api/question/' + questionDraft.id).reply(200)

      testStore.dispatch(editQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isQuestionDraftSaved).toBeTruthy()
    })

    it('shall set isQuestionDraftSaved when question has been created', async () => {
      const questionDraft = createQuestionDraft()
      const expectedQuestion = createQuestion()
      const createQuestionResponse = { question: expectedQuestion } as QuestionResponse
      questionDraft.id = ''
      fakeAxios.onPost('/api/question').reply(200, createQuestionResponse)

      testStore.dispatch(editQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isQuestionDraftSaved).toBeTruthy()
    })

    it('shall set isDisplayValidationMessages to false when question has been edited', async () => {
      const questionDraft = createQuestionDraft()
      fakeAxios.onPost('/api/question/' + questionDraft.id).reply(200)

      testStore.dispatch(editQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isDisplayValidationMessages).toBeFalsy()
    })

    it('shall validate question when question has been edited', async () => {
      const questionDraft = createQuestionDraft()
      fakeAxios.onPost('/api/question/' + questionDraft.id).reply(200)

      questionDraft.message = ''
      testStore.dispatch(editQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isQuestionMissingType).toBeFalsy()
      expect(testStore.getState().ui.uiQuestion.isQuestionMissingMessage).toBeTruthy()
    })
  })

  describe('Handle ValidateQuestion', () => {
    it('shall validate question type', async () => {
      const questionDraft = createQuestionDraft()
      questionDraft.type = QuestionType.MISSING

      testStore.dispatch(validateQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isQuestionMissingType).toBeTruthy()
    })

    it('shall validate question type', async () => {
      const questionDraft = createQuestionDraft()
      questionDraft.message = ''

      testStore.dispatch(validateQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isQuestionMissingMessage).toBeTruthy()
    })
  })

  describe('Handle SendQuestion', () => {
    it('shall handle send question', async () => {
      const questionDraft = createQuestionDraft()
      const expectedQuestion = createQuestion()
      const sendQuestionResponse = { question: expectedQuestion } as QuestionResponse
      testStore.dispatch(updateQuestionDraft(questionDraft))
      fakeAxios.onPost('/api/question/' + questionDraft.id + '/send').reply(200, sendQuestionResponse)

      testStore.dispatch(sendQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(questionDraft)
      expect(testStore.getState().ui.uiQuestion.isQuestionDraftSaved).toBeFalsy()
    })

    it('shall not send question if invalid', async () => {
      const questionDraft = createQuestionDraft()
      questionDraft.type = QuestionType.MISSING
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(validateQuestion(questionDraft))

      testStore.dispatch(sendQuestion(questionDraft))

      await flushPromises()
      expect(fakeAxios.history.post.length).toBe(0)
    })

    it('shall set isDisplayValidationMessages to true when send question if invalid', async () => {
      const questionDraft = createQuestionDraft()
      questionDraft.type = QuestionType.MISSING
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(validateQuestion(questionDraft))

      testStore.dispatch(sendQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isDisplayValidationMessages).toBeTruthy()
    })
  })

  describe('Handle createAnswer', () => {
    it('shall handle create answer', async () => {
      const question = createQuestion()
      testStore.dispatch(updateQuestions([question]))

      testStore.dispatch(createAnswer(question))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0].answer).toBeTruthy()
      expect(testStore.getState().ui.uiQuestion.isAnswerDraftSaved[question.id]).toEqual(false)
    })
  })

  describe('Handle editAnswer', () => {
    it('shall handle edit answer', async () => {
      const question = addAnswerToQuestion(createQuestion(), '')
      testStore.dispatch(updateQuestions([question]))
      const answer = { ...question.answer, message: 'Det här är det första i svaret...' } as Answer
      const saveAnswerResponse = { question: { ...question, answer } } as QuestionResponse
      fakeAxios.onPost('/api/question/' + question.id + '/saveanswer').reply(200, saveAnswerResponse)

      testStore.dispatch(editAnswer({ questionId: question.id, answer }))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0].answer).toEqual(answer)
      expect(fakeAxios.history.post.length).toBe(1)
    })

    it('shall set isAnswerDraftSaved when answer has been saved', async () => {
      const question = addAnswerToQuestion(createQuestion(), '')
      testStore.dispatch(updateQuestions([question]))
      const answer = { ...question.answer, message: 'Det här är det första i svaret...' } as Answer
      const saveAnswerResponse = { question: { ...question, answer } } as QuestionResponse
      fakeAxios.onPost('/api/question/' + question.id + '/saveanswer').reply(200, saveAnswerResponse)

      testStore.dispatch(editAnswer({ questionId: question.id, answer }))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isAnswerDraftSaved[question.id]).toBeTruthy()
    })
  })

  describe('Handle sendAnswer', () => {
    it('shall handle send answer', async () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar!')
      testStore.dispatch(updateQuestions([question]))
      const answer = { ...question.answer } as Answer
      const sendAnswerResponse = {
        question: {
          ...question,
          isHandled: true,
          answer: { ...answer, id: 'answerId', author: 'author', sent: new Date().toISOString() },
        },
      } as QuestionResponse
      fakeAxios.onPost('/api/question/' + question.id + '/sendanswer').reply(200, sendAnswerResponse)

      testStore.dispatch(sendAnswer({ questionId: question.id, answer }))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(sendAnswerResponse.question)
      expect(fakeAxios.history.post.length).toBe(1)
    })
  })

  describe('Handle deleteAnswer', () => {
    it('shall handle delete answer', async () => {
      const question = addAnswerToQuestion(createQuestion(), 'Det här är ett svar!')
      testStore.dispatch(updateQuestions([question]))
      const deleteAnswerResponse = {
        question: {
          ...question,
          answer: undefined,
        },
      } as QuestionResponse
      fakeAxios.onDelete('/api/question/' + question.id).reply(200, deleteAnswerResponse)

      testStore.dispatch(deleteAnswer(question))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0].answer).toBeFalsy()
      expect(fakeAxios.history.delete.length).toBe(1)
    })
  })
})

const getCertificate = (id: string, isQuestionsActive: boolean): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: { id: 'certificateId' },
    links: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      { enabled: isQuestionsActive, type: ResourceLinkType.QUESTIONS },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      { enabled: isQuestionsActive, type: ResourceLinkType.CREATE_QUESTIONS },
    ],
  }
}

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

const createQuestionDraft = (): Question => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return {
    id: 'id',
    message: 'message',
    type: QuestionType.COORDINATION,
  }
}
