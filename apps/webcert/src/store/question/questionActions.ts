import { Answer, Complement, Question } from '@frontend/common'
import { createAction } from '@reduxjs/toolkit'
import { FunctionDisabler, TOGGLE_FUNCTION_DISABLER } from '../../utils/functionDisablerUtils'
import { ApiGenericError } from '../api/apiActions'

const QUESTION = '[Question]'

export const getQuestions = createAction<string>(`${QUESTION} Get questions`)

export const getQuestionsStarted = createAction(`${QUESTION} Get questions started`)

export interface QuestionsResponse {
  questions: Question[]
}

export const getQuestionsSuccess = createAction<QuestionsResponse>(`${QUESTION} Get questions success`)

export const getQuestionsError = createAction<string>(`${QUESTION} Get questions error`)

export const setErrorId = createAction<string>(`${QUESTION} Set error id`)

export const clearErrorId = createAction(`${QUESTION} Clear error id`)

export const getComplementQuestions = createAction<string>(`${QUESTION} Get complement questions`)

export const deleteQuestion = createAction<Question>(`${QUESTION} Delete question`)

export const deleteQuestionStarted = createAction(`${QUESTION} Delete question started`)

export const deleteQuestionSuccess = createAction(`${QUESTION} Delete question success`)

export const deleteQuestionError = createAction<string>(`${QUESTION} Delete question error`)

export const editQuestion = createAction<Question>(`${QUESTION} Edit question`)

export const validateQuestion = createAction<Question>(`${QUESTION} Validate question`)

export const saveQuestion = createAction<Question>(`${QUESTION} Save question`)

export const saveQuestionStarted = createAction(`${QUESTION} Save question started`)

export const saveQuestionSuccess = createAction(`${QUESTION} Save question success`)

export const saveQuestionError = createAction<string>(`${QUESTION} Save question error`)

export const sendQuestion = createAction<Question>(`${QUESTION} Send question`)

export const sendQuestionStarted = createAction(`${QUESTION} Send question started`)

export interface QuestionResponse {
  question: Question
}

export const sendQuestionSuccess = createAction<QuestionResponse>(`${QUESTION} Send question success`)

export const sendQuestionError = createAction<ApiGenericError>(`${QUESTION} Send question error`)

export const updateSendingQuestion = createAction<boolean>(`${QUESTION} Set sending question`)

export const createQuestion = createAction<Question>(`${QUESTION} Create question`)

export const createQuestionStarted = createAction(`${QUESTION} Create question started`)

export const createQuestionSuccess = createAction<QuestionResponse>(`${QUESTION} Create question success`)

export const createQuestionError = createAction<string>(`${QUESTION} Create question error`)

export const updateCertificateId = createAction<string>(`${QUESTION} Update certificateId`)

export const updateQuestion = createAction<Question>(`${QUESTION} Update question`)
export const updateQuestions = createAction<Question[]>(`${QUESTION} Update questions`)

export const addQuestion = createAction<Question>(`${QUESTION} Add question`)

export const updateQuestionDraft = createAction<Question>(`${QUESTION} Update question draft`)

export const updateQuestionDraftSaved = createAction<boolean>(`${QUESTION} Update question draft saved`)

export const updateQuestionMissingType = createAction<boolean>(`${QUESTION} Update question missing type`)

export const updateQuestionMissingMessage = createAction<boolean>(`${QUESTION} Update question missing message`)

export const updateDisplayValidationMessages = createAction<boolean>(`${QUESTION} Update display validation messages`)

export const updateCreateQuestionsAvailable = createAction<boolean>(`${QUESTION} Update create question available`)

export const clearQuestionDraft = createAction(`${QUESTION} Clear question draft`)

export const resetState = createAction(`${QUESTION} Reset state`)

export const createAnswer = createAction<Question>(`${QUESTION} Create answer`)

interface AnswerPayload {
  questionId: string
  answer: Answer
}

export const addAnswer = createAction<AnswerPayload>(`${QUESTION} Add answer`)

export const editAnswer = createAction<AnswerPayload>(`${QUESTION} Edit answer`)

export const updateAnswer = createAction<AnswerPayload>(`${QUESTION} Update answer`)

interface AnswerDraftSavedPayload {
  questionId: string
  isAnswerDraftSaved: boolean
}

export const updateAnswerDraftSaved = createAction<AnswerDraftSavedPayload>(`${QUESTION} Update answer draft saved`)

export const saveAnswer = createAction<AnswerPayload>(`${QUESTION} Save answer`)
export const saveAnswerStarted = createAction(`${QUESTION} Save answer started`)
export const saveAnswerSuccess = createAction<QuestionResponse>(`${QUESTION} Save answer success`)
export const saveAnswerError = createAction<string>(`${QUESTION} Save answer error`)

export const sendAnswer = createAction<AnswerPayload>(`${QUESTION} Send answer`)
export const sendAnswerStarted = createAction(`${QUESTION} Send answer started`)
export const sendAnswerSuccess = createAction<QuestionResponse>(`${QUESTION} Send answer success`)
export const sendAnswerError = createAction<ApiGenericError>(`${QUESTION} Send answer error`)

export const deleteAnswer = createAction<Question>(`${QUESTION} Delete answer`)
export const deleteAnswerStarted = createAction(`${QUESTION} Delete answer started`)
export const deleteAnswerSuccess = createAction<QuestionResponse>(`${QUESTION} Delete answer success`)
export const deleteAnswerError = createAction<string>(`${QUESTION} Delete answer error`)

interface HandleQuestionPayload {
  questionId: string
  handled: boolean
}

export const handleQuestion = createAction<HandleQuestionPayload>(`${QUESTION} Handle question`)
export const handleQuestionStarted = createAction(`${QUESTION} Handle question started`)
export const handleQuestionSuccess = createAction<QuestionResponse>(`${QUESTION} Handle question success`)
export const handleQuestionError = createAction<string>(`${QUESTION} Handle question error`)
export const updateHandledQuestion = createAction<HandleQuestionPayload>(`${QUESTION} Update handled question`)

interface GotoComplementPayload {
  questionId: string
  valueId: string
}

export const gotoComplement = createAction<GotoComplementPayload>(`${QUESTION} Go to complement`)

export const updateComplements = createAction<Complement[]>(`${QUESTION} Update complements`)

export const updateDisplayingCertificateDraft = createAction(`${QUESTION} Update displaying certificate draft`)

export const toggleQuestionFunctionDisabler = createAction<FunctionDisabler>(`${QUESTION} ${TOGGLE_FUNCTION_DISABLER}`)

export const updateIsLoadingQuestions = createAction<boolean>(`${QUESTION} Update is loading questions`)
