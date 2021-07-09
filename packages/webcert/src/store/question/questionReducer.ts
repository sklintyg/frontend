import { createReducer } from '@reduxjs/toolkit'
import { Question } from '@frontend/common'
import { updateQuestions } from './questionActions'

interface QuestionState {
  questions: Question[]
}

const initialState: QuestionState = {
  questions: [],
}

const questionReducer = createReducer(initialState, (builder) =>
  builder.addCase(updateQuestions, (state, action) => {
    state.questions = action.payload
  })
)

export default questionReducer
