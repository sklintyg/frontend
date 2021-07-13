import { createReducer } from '@reduxjs/toolkit'
import { Question } from '@frontend/common'
import { addQuestion, clearQuestionDraft, updateQuestionDraft, updateQuestions } from './questionActions'

interface QuestionState {
  questions: Question[]
  questionDraft: Question
}

const initialState: QuestionState = {
  questions: [],
  questionDraft: defaultQuestionDraft(),
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
)

function defaultQuestionDraft() {
  return { id: '', subject: '', sent: '', message: '', author: '', isForwarded: false, isHandled: false, lastUpdate: '' }
}

export default questionReducer
