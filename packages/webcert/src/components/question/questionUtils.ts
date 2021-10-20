import { Question } from '@frontend/common'

export const getNumberOfUnhandledQuestions = (questions: Question[]): number | undefined => {
  const unhandledQuestions = questions.filter((question) => !question.handled)
  return unhandledQuestions.length > 0 ? unhandledQuestions.length : undefined
}

export const getQuestionsOrderedByLastUpdatedAndHandled = (questions: Question[]): Question[] => {
  return questions.sort((questionA, questionB) => orderByLastUpdated(questionA, questionB)).sort((question) => (question.handled ? -1 : 1))
}

const orderByLastUpdated = (questionA: Question, questionB: Question) => {
  const dateA = new Date(questionA.lastUpdate).getTime()
  const dateB = new Date(questionB.lastUpdate).getTime()

  return dateA > dateB ? 1 : -1
}
