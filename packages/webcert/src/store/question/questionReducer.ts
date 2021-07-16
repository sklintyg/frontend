import { createReducer } from '@reduxjs/toolkit'
import { Question } from '@frontend/common'
import {
  addQuestion,
  clearQuestionDraft,
  resetState,
  updateCertificateId,
  updateCreateQuestionsAvailable,
  updateDisplayValidationMessages,
  updateQuestionDraft,
  updateQuestionDraftSaved,
  updateQuestionMissingMessage,
  updateQuestionMissingType,
  updateQuestions,
} from './questionActions'
import { QuestionType } from '@frontend/common/src'

interface QuestionState {
  questions: Question[]
  questionDraft: Question
  certificateId: string
  isQuestionDraftSaved: boolean
  isQuestionMissingType: boolean
  isQuestionMissingMessage: boolean
  isDisplayValidationMessages: boolean
  isCreateQuestionsAvailable: boolean
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
  }
}

const questionReducer = createReducer(getInitialState(), (builder) =>
  builder
    .addCase(updateQuestions, (state, action) => {
      state.questions = action.payload
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
)

function defaultQuestionDraft() {
  return {
    id: '',
    type: QuestionType.MISSING,
    subject: '',
    sent: '',
    message: '',
    author: '',
    isForwarded: false,
    isHandled: false,
    lastUpdate: '',
  }
}

export default questionReducer
