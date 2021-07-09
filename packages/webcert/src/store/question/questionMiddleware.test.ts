import MockAdapter from 'axios-mock-adapter'
import { Certificate, Question } from '@frontend/common'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import { questionMiddleware } from './questionMiddleware'
import { updateCertificate } from '../certificate/certificateActions'
import { getQuestions, QuestionsResponse } from './questionActions'

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
})

const getCertificate = (id: string): Certificate => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return { metadata: { id: 'certificateId' } }
}

const createQuestion = (): Question => {
  return {
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
