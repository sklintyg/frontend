import { Question } from '@frontend/common'
import { createAction } from '@reduxjs/toolkit'

export const getQuestions = createAction<string>('[Question] Get questions')

export const getQuestionsStarted = createAction('[Question] Get questions started')

export interface QuestionsResponse {
  questions: Question[]
}

export const getQuestionsSuccess = createAction<QuestionsResponse>('[Question] Get questions success')

export const getQuestionsError = createAction<string>('[Question] Get questions error')

export const deleteQuestion = createAction<Question>('[Question] Delete question')

export const deleteQuestionStarted = createAction('[Question] Delete question started')

export const deleteQuestionSuccess = createAction('[Question] Delete question success')

export const deleteQuestionError = createAction<string>('[Question] Delete question error')

export const saveQuestion = createAction<Question>('[Question] Save question')

export const saveQuestionStarted = createAction('[Question] Save question started')

export const saveQuestionSuccess = createAction('[Question] Save question success')

export const saveQuestionError = createAction<string>('[Question] Save question error')

export const sendQuestion = createAction<Question>('[Question] Send question')

export const sendQuestionStarted = createAction('[Question] Send question started')

export interface QuestionResponse {
  question: Question
}

export const sendQuestionSuccess = createAction<QuestionResponse>('[Question] Send question success')

export const sendQuestionError = createAction<string>('[Question] Send question error')

export const createQuestion = createAction<Question>('[Question] Create question')

export const createQuestionStarted = createAction('[Question] Create question started')

export const createQuestionSuccess = createAction<QuestionResponse>('[Question] Create question success')

export const createQuestionError = createAction<string>('[Question] Create question error')

export const updateCertificateId = createAction<string>('[Question] Update certificateId')

export const updateQuestions = createAction<Question[]>('[Question] Update questions')

export const addQuestion = createAction<Question>('[Question] Add question')

export const updateQuestionDraft = createAction<Question>('[Question] Update question draft')

export const updateQuestionDraftSaved = createAction<boolean>('[Question] Update question draft saved')

export const updateCreateQuestionsAvailable = createAction<boolean>('[Question] Update create question available')

export const clearQuestionDraft = createAction('[Question] Clear question draft')
