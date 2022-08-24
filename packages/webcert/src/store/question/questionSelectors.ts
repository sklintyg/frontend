import { RootState } from '../store'
import { Question } from '@frontend/common'

export const getQuestions = (state: RootState): Question[] => state.ui.uiQuestion.questions

export const getQuestionDraft = (state: RootState): Question => state.ui.uiQuestion.questionDraft

export const isQuestionDraftSaved = (state: RootState): boolean => state.ui.uiQuestion.isQuestionDraftSaved

export const isQuestionMissingType = (state: RootState): boolean => state.ui.uiQuestion.isQuestionMissingType

export const isQuestionMissingMessage = (state: RootState): boolean => state.ui.uiQuestion.isQuestionMissingMessage

export const isDisplayValidationMessages = (state: RootState): boolean => state.ui.uiQuestion.isDisplayValidationMessages

export const isCreateQuestionsAvailable = (state: RootState): boolean => state.ui.uiQuestion.isCreateQuestionsAvailable

export const isAnswerDraftSaved = (questionId: string) => (state: RootState): boolean => state.ui.uiQuestion.isAnswerDraftSaved[questionId]

export const isDisplayingCertificateDraft = (state: RootState): boolean => state.ui.uiQuestion.isDisplayingCertificateDraft

export const isQuestionFunctionDisabled = (state: RootState): boolean => state.ui.uiQuestion.functionDisablers.length > 0

export const getErrorId = (state: RootState): string => state.ui.uiQuestion.errorId

export const getIsLoadingQuestions = (state: RootState): boolean => state.ui.uiQuestion.isLoadingQuestions

export const getCertificateId = (state: RootState): string => state.ui.uiQuestion.certificateId

export const getHasUnhandledQuestions = (state: RootState): boolean =>
  state.ui.uiQuestion.questions.filter((question) => !question.handled).length > 0
