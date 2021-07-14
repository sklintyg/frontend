import { createReducer } from '@reduxjs/toolkit'
import { Question } from '@frontend/common'
import { addQuestion, clearQuestionDraft, updateCertificateId, updateQuestionDraft, updateQuestions } from './questionActions'
import { QuestionType } from '@frontend/common/src'

interface QuestionState {
  questions: Question[]
  questionDraft: Question
  certificateId: string
}

const initialState: QuestionState = {
  questions: [],
  questionDraft: defaultQuestionDraft(),
  certificateId: '',
}

const questionReducer = createReducer(initialState, (builder) =>
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
    })
    .addCase(updateCertificateId, (state, action) => {
      state.certificateId = action.payload
    })
)

function defaultQuestionDraft() {
  return {
    id: '',
    type: QuestionType.DEFAULT,
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
