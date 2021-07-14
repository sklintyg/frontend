import MockAdapter from 'axios-mock-adapter'
import { Certificate, Question, QuestionType } from '@frontend/common'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import { questionMiddleware } from './questionMiddleware'
import { updateCertificate } from '../certificate/certificateActions'
import {
  deleteQuestion,
  getQuestions,
  QuestionResponse,
  QuestionsResponse,
  saveQuestion,
  sendQuestion,
  updateQuestionDraft,
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
      fakeAxios.onGet('/api/question/' + 'certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
    })

    it('shall handle get questions with question draft', async () => {
      const expectedQuestion = createQuestionDraft()
      const getQuestionResponse = { questions: [expectedQuestion] } as QuestionsResponse
      fakeAxios.onGet('/api/question/' + 'certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).toEqual(expectedQuestion)
      expect(testStore.getState().ui.uiQuestion.questions).toHaveLength(0)
    })

    it('shall handle get questions without question draft', async () => {
      const getQuestionResponse = { questions: [] } as QuestionsResponse
      fakeAxios.onGet('/api/question/' + 'certificateId').reply(200, getQuestionResponse)
      const questionDraft = createQuestionDraft()
      testStore.dispatch(updateQuestionDraft(questionDraft))

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(questionDraft)
    })
  })

  describe('Handle UpdateCertificate', () => {
    it('shall get questions when certificate is updated', async () => {
      const expectedQuestion = createQuestion()
      const getQuestionResponse = { questions: [expectedQuestion] } as QuestionsResponse
      fakeAxios.onGet('/api/question/' + 'certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCertificate(getCertificate('certificateId')))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
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

  describe('Handle SaveQuestion', () => {
    it('shall handle save question', async () => {
      const questionDraft = createQuestionDraft()
      testStore.dispatch(updateQuestionDraft(questionDraft))
      fakeAxios.onPost('/api/question/' + questionDraft.id).reply(200)

      const editedDraft = { ...questionDraft, message: 'new message' }
      testStore.dispatch(saveQuestion(editedDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).toEqual(editedDraft)
      expect(fakeAxios.history.post.length).toBe(1)
    })

    it('shall handle save question without type', async () => {
      const questionDraft = createQuestionDraft()
      questionDraft.type = QuestionType.DEFAULT
      fakeAxios.onPost('/api/question/' + questionDraft.id).reply(200)

      testStore.dispatch(saveQuestion(questionDraft))

      await flushPromises()
      expect(JSON.parse(fakeAxios.history.post[0].data).question.type).toBeFalsy()
    })

    it('shall handle save question without id', async () => {
      const questionDraft = createQuestionDraft()
      const expectedQuestion = createQuestion()
      const createQuestionResponse = { question: expectedQuestion } as QuestionResponse
      questionDraft.id = ''
      testStore.dispatch(updateQuestionDraft(questionDraft))
      fakeAxios.onPost('/api/question').reply(200, createQuestionResponse)

      testStore.dispatch(saveQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).toEqual(expectedQuestion)
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
    })
  })
})

const getCertificate = (id: string): Certificate => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return { metadata: { id: 'certificateId' } }
}

const createQuestion = (): Question => {
  return {
    type: QuestionType.COORDINATION,
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

const createQuestionDraft = (): Question => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return {
    id: 'id',
    message: 'message',
    type: QuestionType.COORDINATION,
  }
}
