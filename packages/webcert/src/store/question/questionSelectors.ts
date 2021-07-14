import { RootState } from '../store'
import { Question } from '@frontend/common'

export const getQuestions = (state: RootState): Question[] => state.ui.uiQuestion.questions

export const getQuestionDraft = (state: RootState): Question => state.ui.uiQuestion.questionDraft

export const isQuestionDraftSaved = (state: RootState): boolean => state.ui.uiQuestion.isQuestionDraftSaved
