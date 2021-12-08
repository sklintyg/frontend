import { createReducer } from '@reduxjs/toolkit'
import { Question } from '@frontend/common'
import {
  addAnswer,
  addQuestion,
  clearQuestionDraft,
  resetState,
  toggleQuestionFunctionDisabler,
  updateAnswer,
  updateAnswerDraftSaved,
  updateCertificateId,
  updateCreateQuestionsAvailable,
  updateDisplayingCertificateDraft,
  updateDisplayValidationMessages,
  updateHandledQuestion,
  updateQuestion,
  updateQuestionDraft,
  updateQuestionDraftSaved,
  updateQuestionMissingMessage,
  updateQuestionMissingType,
  updateQuestions,
  updateSendingQuestion,
} from './questionActions'
import { QuestionType } from '@frontend/common/src'
import { FunctionDisabler, toggleFunctionDisabler } from '../../components/utils/functionDisablerUtils'

interface QuestionState {
  questions: Question[]
  questionDraft: Question
  certificateId: string
  isQuestionDraftSaved: boolean
  isQuestionMissingType: boolean
  isQuestionMissingMessage: boolean
  isDisplayValidationMessages: boolean
  isCreateQuestionsAvailable: boolean
  isAnswerDraftSaved: {
    [questionId: string]: boolean
  }
  isDisplayingCertificateDraft: boolean
  isSendingQuestion: boolean
  functionDisablers: FunctionDisabler[]
}

const getInitialState = (): QuestionState => {
  return {
    questions: [],
    questionDraft: defaultQuestionDraft(),
    certificateId: '',
    isQuestionDraftSaved: false,
    isQuestionMissingType: false,
    isQuestionMissingMessage: false,
    isDisplayValidationMessages: false,
    isCreateQuestionsAvailable: false,
    isAnswerDraftSaved: {},
    isDisplayingCertificateDraft: false,
    isSendingQuestion: false,
    functionDisablers: [],
  }
}

const questionReducer = createReducer(getInitialState(), (builder) =>
  builder
    .addCase(updateQuestions, (state, action) => {
      state.questions = action.payload
    })
    .addCase(updateQuestion, (state, action) => {
      const index = state.questions.findIndex((question) => question.id === action.payload.id)
      if (index === -1) {
        state.questions.push(action.payload)
      } else {
        state.questions[index] = action.payload
      }
    })
    .addCase(addQuestion, (state, action) => {
      state.questions.push(action.payload)
    })
    .addCase(updateQuestionDraft, (state, action) => {
      state.questionDraft = action.payload
    })
    .addCase(clearQuestionDraft, (state) => {
      state.questionDraft = defaultQuestionDraft()
      state.isQuestionDraftSaved = false
      state.isQuestionMissingType = false
      state.isQuestionMissingMessage = false
      state.isDisplayValidationMessages = false
      state.isSendingQuestion = false
    })
    .addCase(updateCertificateId, (state, action) => {
      state.certificateId = action.payload
    })
    .addCase(updateQuestionDraftSaved, (state, action) => {
      state.isQuestionDraftSaved = action.payload
    })
    .addCase(updateQuestionMissingType, (state, action) => {
      state.isQuestionMissingType = action.payload
    })
    .addCase(updateQuestionMissingMessage, (state, action) => {
      state.isQuestionMissingMessage = action.payload
    })
    .addCase(updateCreateQuestionsAvailable, (state, action) => {
      state.isCreateQuestionsAvailable = action.payload
    })
    .addCase(updateDisplayValidationMessages, (state, action) => {
      state.isDisplayValidationMessages = action.payload
    })
    .addCase(resetState, () => getInitialState())
    .addCase(addAnswer, (state, action) => {
      const question = state.questions.find((question) => question.id === action.payload.questionId)
      if (question) {
        question.answer = action.payload.answer
      }
    })
    .addCase(updateAnswer, (state, action) => {
      const question = state.questions.find((question) => question.id === action.payload.questionId)
      if (question) {
        question.answer = action.payload.answer
      }
    })
    .addCase(updateAnswerDraftSaved, (state, action) => {
      state.isAnswerDraftSaved[action.payload.questionId] = action.payload.isAnswerDraftSaved
    })
    .addCase(updateHandledQuestion, (state, action) => {
      const question = state.questions.find((question) => question.id === action.payload.questionId)
      if (question) {
        question.handled = action.payload.handled
      }
    })
    .addCase(updateDisplayingCertificateDraft, (state) => {
      state.isDisplayingCertificateDraft = true
    })
    .addCase(updateSendingQuestion, (state, action) => {
      state.isSendingQuestion = action.payload
    })
    .addCase(toggleQuestionFunctionDisabler, (state, action) => {
      state.functionDisablers = toggleFunctionDisabler(state.functionDisablers, action.payload)
    })
)

function defaultQuestionDraft(): Question {
  return {
    id: '',
    type: QuestionType.MISSING,
    subject: '',
    sent: '',
    complements: [],
    message: '',
    author: '',
    forwarded: false,
    handled: false,
    lastUpdate: '',
    links: [],
    reminders: [],
  }
}

export default questionReducer
