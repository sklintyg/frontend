import { RootState } from '../store'
import { Question } from '@frontend/common'

export const getQuestions = (state: RootState): Question[] => state.ui.uiQuestion.questions

export const getQuestionDraft = (state: RootState): Question => state.ui.uiQuestion.questionDraft

export const isQuestionDraftSaved = (state: RootState): boolean => state.ui.uiQuestion.isQuestionDraftSaved

export const isQuestionMissingType = (state: RootState): boolean => state.ui.uiQuestion.isQuestionMissingType

export const isQuestionMissingMessage = (state: RootState): boolean => state.ui.uiQuestion.isQuestionMissingMessage

export const isDisplayValidationMessages = (state: RootState): boolean => state.ui.uiQuestion.isDisplayValidationMessages

export const isCreateQuestionsAvailable = (state: RootState): boolean => state.ui.uiQuestion.isCreateQuestionsAvailable
