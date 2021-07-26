import { Answer, Complement, Question } from '@frontend/common'
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

export const editQuestion = createAction<Question>('[Question] Edit question')

export const validateQuestion = createAction<Question>('[Question] Validate question')

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

export const updateQuestion = createAction<Question>('[Question] Update question')
export const updateQuestions = createAction<Question[]>('[Question] Update questions')

export const addQuestion = createAction<Question>('[Question] Add question')

export const updateQuestionDraft = createAction<Question>('[Question] Update question draft')

export const updateQuestionDraftSaved = createAction<boolean>('[Question] Update question draft saved')

export const updateQuestionMissingType = createAction<boolean>('[Question] Update question missing type')

export const updateQuestionMissingMessage = createAction<boolean>('[Question] Update question missing message')

export const updateDisplayValidationMessages = createAction<boolean>('[Question] Update display validation messages')

export const updateCreateQuestionsAvailable = createAction<boolean>('[Question] Update create question available')

export const clearQuestionDraft = createAction('[Question] Clear question draft')

export const resetState = createAction('[Question] Reset state')

export const createAnswer = createAction<Question>('[Question] Create answer')

interface AnswerPayload {
  questionId: string
  answer: Answer
}

export const addAnswer = createAction<AnswerPayload>('[Question] Add answer')

export const editAnswer = createAction<AnswerPayload>('[Question] Edit answer')

export const updateAnswer = createAction<AnswerPayload>('[Question] Update answer')

interface AnswerDraftSavedPayload {
  questionId: string
  isAnswerDraftSaved: boolean
}

export const updateAnswerDraftSaved = createAction<AnswerDraftSavedPayload>('[Question] Update answer draft saved')

export const saveAnswer = createAction<AnswerPayload>('[Question] Save answer')
export const saveAnswerStarted = createAction('[Question] Save answer started')
export const saveAnswerSuccess = createAction<QuestionResponse>('[Question] Save answer success')
export const saveAnswerError = createAction<string>('[Question] Save answer error')

export const sendAnswer = createAction<AnswerPayload>('[Question] Send answer')
export const sendAnswerStarted = createAction('[Question] Send answer started')
export const sendAnswerSuccess = createAction<QuestionResponse>('[Question] Send answer success')
export const sendAnswerError = createAction<string>('[Question] Send answer error')

export const deleteAnswer = createAction<Question>('[Question] Delete answer')
export const deleteAnswerStarted = createAction('[Question] Delete answer started')
export const deleteAnswerSuccess = createAction<QuestionResponse>('[Question] Delete answer success')
export const deleteAnswerError = createAction<string>('[Question] Delete answer error')

interface HandleQuestionPayload {
  questionId: string
  handled: boolean
}

export const handleQuestion = createAction<HandleQuestionPayload>('[Question] Handle question')
export const handleQuestionStarted = createAction('[Question] Handle question started')
export const handleQuestionSuccess = createAction<QuestionResponse>('[Question] Handle question success')
export const handleQuestionError = createAction<string>('[Question] Handle question error')
export const updateHandledQuestion = createAction<HandleQuestionPayload>('[Question] Update handled question')

interface GotoComplementPayload {
  questionId: string
  valueId: string
}

export const gotoComplement = createAction<GotoComplementPayload>('[Question] Go to complement')

export const updateComplements = createAction<Complement[]>('[Question] Update complements')
