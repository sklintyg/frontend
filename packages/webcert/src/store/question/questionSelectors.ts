import { RootState } from '../store'
import { Question } from '@frontend/common'

export const getQuestions = (state: RootState): Question[] => state.ui.uiQuestion.questions
