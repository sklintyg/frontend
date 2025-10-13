import type { Question } from '../../types'
import { isFunctionDisabled } from '../api/requestSlice'
import type { RootState } from '../reducer'
import { toggleQuestionFunctionDisabler } from './questionActions'

export const getQuestions = (state: RootState): Question[] => state.ui.uiQuestion.questions

export const getQuestionDraft = (state: RootState): Question => state.ui.uiQuestion.questionDraft

export const isQuestionDraftSaved = (state: RootState): boolean => state.ui.uiQuestion.isQuestionDraftSaved

export const isQuestionMissingType = (state: RootState): boolean => state.ui.uiQuestion.isQuestionMissingType

export const isQuestionMissingMessage = (state: RootState): boolean => state.ui.uiQuestion.isQuestionMissingMessage

export const isDisplayValidationMessages = (state: RootState): boolean => state.ui.uiQuestion.isDisplayValidationMessages

export const isCreateQuestionsAvailable = (state: RootState): boolean => state.ui.uiQuestion.isCreateQuestionsAvailable

export const isAnswerDraftSaved =
  (questionId: string) =>
  (state: RootState): boolean =>
    state.ui.uiQuestion.isAnswerDraftSaved[questionId]

export const isDisplayingCertificateDraft = (state: RootState): boolean => state.ui.uiQuestion.isDisplayingCertificateDraft

export const isQuestionFunctionDisabled = isFunctionDisabled(toggleQuestionFunctionDisabler.type)

export const getErrorId = (state: RootState): string => state.ui.uiQuestion.errorId

export const getIsLoadingQuestions = (state: RootState): boolean => state.ui.uiQuestion.isLoadingQuestions

export const getHasUnhandledQuestions = (state: RootState): boolean =>
  state.ui.uiQuestion.questions.filter((question) => !question.handled).length > 0
