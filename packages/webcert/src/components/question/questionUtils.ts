import { Question } from '@frontend/common'
import { firstBy } from 'thenby'

export const getNumberOfUnhandledQuestions = (questions: Question[]): number | undefined => {
  const unhandledQuestions = questions.filter((question) => !question.handled)
  return unhandledQuestions.length > 0 ? unhandledQuestions.length : undefined
}

export const getShouldComplementedBeActive = (administrativeQuestions: Question[], complementQuestions: Question[]): boolean => {
  if (areComplementAndAdministrativeEmpty(administrativeQuestions, complementQuestions)) return true
  if (doesComplementAndAdministrativeHaveUnhandledQuestions(administrativeQuestions, complementQuestions)) return true
  if (onlyAdministrativeQuestionsAreUnhandled(administrativeQuestions, complementQuestions)) return false

  return true
}

const areComplementAndAdministrativeEmpty = (administrativeQuestions: Question[], complementQuestions: Question[]) => {
  return (!administrativeQuestions || !administrativeQuestions.length) && (!complementQuestions || !complementQuestions.length)
}

const doesComplementAndAdministrativeHaveUnhandledQuestions = (administrativeQuestions: Question[], complementQuestions: Question[]) => {
  const numberOfUnhandledComplementQuestions = getNumberOfUnhandledQuestions(complementQuestions)
  const numberOfUnhandledAdministrativeQuestions = getNumberOfUnhandledQuestions(administrativeQuestions)

  return (
    numberOfUnhandledAdministrativeQuestions &&
    numberOfUnhandledAdministrativeQuestions > 0 &&
    numberOfUnhandledComplementQuestions &&
    numberOfUnhandledComplementQuestions > 0
  )
}

const onlyAdministrativeQuestionsAreUnhandled = (administrativeQuestions: Question[], complementQuestions: Question[]): boolean => {
  const numberOfUnhandledComplementQuestions = getNumberOfUnhandledQuestions(complementQuestions)
  const numberOfUnhandledAdministrativeQuestions = getNumberOfUnhandledQuestions(administrativeQuestions)

  return (
    numberOfUnhandledComplementQuestions === undefined &&
    numberOfUnhandledAdministrativeQuestions !== undefined &&
    numberOfUnhandledAdministrativeQuestions > 0
  )
}

export const getQuestionsOrderedByLastUpdatedAndHandled = (questions: Question[]): Question[] => {
  return questions.sort(
    firstBy((questionA) => ((questionA as Question).handled ? -1 : 1)).thenBy((questionA, questionB) => {
      const dateA = new Date(questionA.lastUpdate).getTime()
      const dateB = new Date(questionB.lastUpdate).getTime()

      return dateA < dateB ? 1 : -1
    })
  )
}