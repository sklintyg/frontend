import { Question } from '@frontend/common'
import { createAction } from '@reduxjs/toolkit'

export const getQuestions = createAction<string>('[Question] Get questions')

export const updateQuestions = createAction<Question[]>('[Question] Update questions')

export const getQuestionsStarted = createAction('[Question] Get questions started')

export interface QuestionsResponse {
  questions: Question[]
}

export const getQuestionsSuccess = createAction<QuestionsResponse>('[Question] Get questions success')

export const getQuestionsError = createAction<string>('[Question] Get questions error')
