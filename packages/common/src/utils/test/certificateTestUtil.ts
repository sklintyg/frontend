import { Question, QuestionType } from '../../types/question'

export const getQuestions = (handled: boolean, type: QuestionType): Question[] => {
  return [{ type: type, handled: handled } as Question]
}
