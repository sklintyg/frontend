import { Answer, Certificate, CertificateRelationType, CertificateStatus, Complement, Question, QuestionType } from '@frontend/common/types'
import { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { updateCertificate } from '../certificate/certificateActions'
import { certificateMiddleware } from '../certificate/certificateMiddleware'
import { configureApplicationStore } from '../configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../test/dispatchHelperMiddleware'
import {
  QuestionResponse,
  QuestionsResponse,
  createAnswer,
  deleteAnswer,
  deleteQuestion,
  editAnswer,
  editQuestion,
  getQuestions,
  handleQuestion,
  sendAnswer,
  sendQuestion,
  sendQuestionError,
  setErrorId,
  updateComplements,
  updateCreateQuestionsAvailable,
  updateQuestionDraft,
  updateQuestions,
  updateSendingQuestion,
  validateQuestion,
} from './questionActions'
import { questionMiddleware } from './questionMiddleware'

const getCertificate = (id: string, isQuestionsActive: boolean): Certificate => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  metadata: { id: 'certificateId' },
  status: CertificateStatus.SIGNED,
  links: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { enabled: isQuestionsActive, type: ResourceLinkType.QUESTIONS },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { enabled: isQuestionsActive, type: ResourceLinkType.CREATE_QUESTIONS },
  ],
})

const addParentCertificate = (certificate: Certificate, parentId: string): Certificate => ({
  ...certificate,
  metadata: {
    ...certificate.metadata,
    status: CertificateStatus.UNSIGNED,
    relations: {
      parent: {
        certificateId: parentId,
        type: CertificateRelationType.COMPLEMENTED,
        status: CertificateStatus.SIGNED,
        created: new Date().toISOString(),
      },
      children: [],
    },
  },
})

const addAnswerToQuestion = (question: Question, message: string): Question =>
  ({
    ...question,
    answer: { author: '', id: '', message, sent: '' },
  }) as Question

const addComplementsToQuestion = (question: Question, complements: Complement[]): Question =>
  ({
    ...question,
    type: QuestionType.COMPLEMENT,
    complements: [...complements],
  }) as Question

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
  subject: 'subject',
  reminders: [],
  links: [],
})

const createComplement = (): Question => ({
  type: QuestionType.COMPLEMENT,
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
  links: [],
})

const createQuestionDraft = (): Question =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ({
    id: 'id',
    message: 'message',
    type: QuestionType.COORDINATION,
  })

describe('Test question middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, questionMiddleware, certificateMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Handle GetQuestions', () => {
    it('shall handle get questions', async () => {
      const expectedQuestion = createQuestion()
      const getQuestionResponse: QuestionsResponse = { questions: [expectedQuestion] }
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
    })

    it('shall handle get questions with question draft', async () => {
      const expectedQuestion = createQuestionDraft()
      const getQuestionResponse: QuestionsResponse = { questions: [expectedQuestion] }
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
      const getQuestionResponse: QuestionsResponse = { questions: [expectedQuestion] }
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCreateQuestionsAvailable(false))
      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(expectedQuestion)
      expect(testStore.getState().ui.uiQuestion.questions).toHaveLength(0)
    })

    it('shall handle get questions without question draft', async () => {
      const getQuestionResponse: QuestionsResponse = { questions: [] }
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)
      const questionDraft = createQuestionDraft()

      testStore.dispatch(updateCreateQuestionsAvailable(true))
      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(questionDraft)
      expect(testStore.getState().ui.uiQuestion.isQuestionDraftSaved).toBeFalsy()
    })

    it('shall handle get questions with question answer draft', async () => {
      const expectedQuestion = addAnswerToQuestion(createQuestion(), '')
      const getQuestionResponse = { questions: [expectedQuestion] }
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
      expect(testStore.getState().ui.uiQuestion.isAnswerDraftSaved[expectedQuestion.id]).toBeTruthy()
    })

    it('shall handle get questions with complements', async () => {
      const expectedComplements: Complement[] = [
        { message: 'Vi behöver komplettering', valueId: 'valueId', questionId: 'questionId', questionText: 'questionText' },
      ]
      const expectedQuestion = addComplementsToQuestion(createQuestion(), expectedComplements)
      const getQuestionResponse = { questions: [expectedQuestion] }
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      const updateComplementsAction = dispatchedActions.find((action) => updateComplements.match(action))
      expect(updateComplementsAction?.payload).toEqual(expectedComplements)
      expect(testStore.getState().ui.uiQuestion.questions[0].complements).toEqual(expectedComplements)
    })

    it('shall save errorId if questions cannot be fetched', async () => {
      fakeAxios.onGet('/api/question/certificateId').reply(500, null)

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.errorId.length > 0).toBeTruthy()
    })

    it('shall clear errorId if questions have been fetched', async () => {
      fakeAxios.onGet('/api/question/certificateId').reply(200, { questions: [] })
      testStore.dispatch(setErrorId('errorId'))

      testStore.dispatch(getQuestions('certificateId'))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.errorId).toEqual('')
    })
  })

  describe('Handle UpdateCertificate', () => {
    it('shall get questions when certificate is updated', async () => {
      const expectedQuestion = createQuestion()
      const getQuestionResponse = { questions: [expectedQuestion] }
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCertificate(getCertificate('certificateId', true)))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
    })

    it('shall get questions for complemented certificate when certificate is a draft is updated', async () => {
      const certificate = addParentCertificate(getCertificate('certificateId', true), 'parentId')
      const expectedQuestion = addComplementsToQuestion(createQuestion(), [])
      const getQuestionResponse = { questions: [expectedQuestion] }
      fakeAxios.onGet('/api/question/parentId/complements').reply(200, getQuestionResponse)

      testStore.dispatch(updateCertificate(certificate))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
      expect(testStore.getState().ui.uiQuestion.isDisplayingCertificateDraft).toEqual(true)
    })

    it('shall not get questions when resource link is missing', async () => {
      const expectedQuestion = createQuestion()
      const getQuestionResponse = { questions: [expectedQuestion] }
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
      const getQuestionResponse = { questions: [] }
      fakeAxios.onGet('/api/question/certificateId').reply(200, getQuestionResponse)

      testStore.dispatch(updateCertificate(getCertificate('certificateId', true)))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.certificateId).toEqual('certificateId')
    })

    it('shall set isCreateQuestionsAvailable when certificate is updated', async () => {
      const getQuestionResponse = { questions: [] }
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
      fakeAxios.onDelete(`/api/question/${questionDraft.id}`).reply(200)

      testStore.dispatch(deleteQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(questionDraft)
    })
  })

  describe('Handle Edit', () => {
    it('shall handle save question', async () => {
      const questionDraft = createQuestionDraft()
      testStore.dispatch(updateQuestionDraft(questionDraft))
      fakeAxios.onPost(`/api/question/${questionDraft.id}`).reply(200)

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
      fakeAxios.onPost(`/api/question/${questionDraft.id}`).reply(200)

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
      fakeAxios.onPost(`/api/question/${questionDraft.id}`).reply(200)

      testStore.dispatch(editQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isDisplayValidationMessages).toBeFalsy()
    })

    it('shall validate question when question has been edited', async () => {
      const questionDraft = createQuestionDraft()
      fakeAxios.onPost(`/api/question/${questionDraft.id}`).reply(200)

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

    it('shall validate question message', async () => {
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
      fakeAxios.onPost(`/api/question/${questionDraft.id}/send`).reply(200, sendQuestionResponse)

      testStore.dispatch(sendQuestion(questionDraft))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0]).toEqual(expectedQuestion)
      expect(testStore.getState().ui.uiQuestion.questionDraft).not.toEqual(questionDraft)
      expect(testStore.getState().ui.uiQuestion.isQuestionDraftSaved).toBeFalsy()
      expect(testStore.getState().ui.uiQuestion.isSendingQuestion).toBeFalsy()
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

    it('shall set isSending to true when sending question', async () => {
      const questionDraft = createQuestionDraft()
      testStore.dispatch(updateQuestionDraft(questionDraft))
      testStore.dispatch(validateQuestion(questionDraft))

      testStore.dispatch(sendQuestion(questionDraft))

      await flushPromises()
      const updateSendingQuestionAction = dispatchedActions.find((action) => updateSendingQuestion.match(action))
      expect(updateSendingQuestionAction?.payload).toEqual(true)
    })

    it('shall set isSending to false when sending question fails', async () => {
      testStore.dispatch(updateSendingQuestion(true))
      testStore.dispatch(
        sendQuestionError({
          error: {
            errorCode: 'UNEXPECTED_ERROR',
            api: 'POST /api/send',
            message: 'something went wrong',
          },
        })
      )

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.isSendingQuestion).toEqual(false)
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
      fakeAxios.onPost(`/api/question/${question.id}/saveanswer`).reply(200, saveAnswerResponse)

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
      fakeAxios.onPost(`/api/question/${question.id}/saveanswer`).reply(200, saveAnswerResponse)

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
          handled: true,
          answer: { ...answer, id: 'answerId', author: 'author', sent: new Date().toISOString() },
        },
      } as QuestionResponse
      fakeAxios.onPost(`/api/question/${question.id}/sendanswer`).reply(200, sendAnswerResponse)

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
      fakeAxios.onDelete(`/api/question/${question.id}/answer`).reply(200, deleteAnswerResponse)

      testStore.dispatch(deleteAnswer(question))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0].answer).toBeFalsy()
      expect(fakeAxios.history.delete.length).toBe(1)
    })
  })

  describe('Handle handleQuestion', () => {
    it('shall set question to handled', async () => {
      const question = createQuestion()
      testStore.dispatch(updateQuestions([question]))
      const handleQuestionResponse = {
        question: {
          ...question,
          handled: true,
        },
      } as QuestionResponse
      fakeAxios.onPost(`/api/question/${question.id}/handle`).reply(200, handleQuestionResponse)

      testStore.dispatch(handleQuestion({ questionId: question.id, handled: true }))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0].handled).toEqual(true)
      expect(fakeAxios.history.post.length).toBe(1)
    })

    it('shall reload certificate after setting complement to handled', async () => {
      const question = createComplement()
      testStore.dispatch(updateQuestions([question]))
      const handleQuestionResponse = {
        question: {
          ...question,
          handled: true,
        },
      } as QuestionResponse
      fakeAxios.onPost(`/api/question/${question.id}/handle`).reply(200, handleQuestionResponse)

      testStore.dispatch(handleQuestion({ questionId: question.id, handled: true }))

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(1)
      expect(fakeAxios.history.get[0].url).toEqual('/api/certificate/')
    })

    it('shall not reload certificate after setting question to handled', async () => {
      const question = createQuestion()
      testStore.dispatch(updateQuestions([question]))
      const handleQuestionResponse = {
        question: {
          ...question,
          handled: true,
        },
      } as QuestionResponse
      fakeAxios.onPost(`/api/question/${question.id}/handle`).reply(200, handleQuestionResponse)

      testStore.dispatch(handleQuestion({ questionId: question.id, handled: true }))

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(0)
    })

    it('shall set question to unhandled', async () => {
      const question = createQuestion()
      testStore.dispatch(updateQuestions([question]))
      const handleQuestionResponse = {
        question: {
          ...question,
          handled: false,
        },
      } as QuestionResponse
      fakeAxios.onPost(`/api/question/${question.id}/handle`).reply(200, handleQuestionResponse)

      testStore.dispatch(handleQuestion({ questionId: question.id, handled: false }))

      await flushPromises()
      expect(testStore.getState().ui.uiQuestion.questions[0].handled).toEqual(false)
      expect(fakeAxios.history.post.length).toBe(1)
    })
  })
})
