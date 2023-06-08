import { Question } from '@frontend/common'

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
  return questions.sort((questionA, questionB) => {
    return (
      compare(new Date(questionA.lastUpdate).getTime(), new Date(questionB.lastUpdate).getTime()) ||
      compare(convertBooleanToNumber(questionA.handled), convertBooleanToNumber(questionB.handled))
    )
  })
}

const compare = function(a: number, b: number) {
  if (a > b) return -1
  if (a < b) return 1

  return 0
}

const convertBooleanToNumber = (value: boolean) => (value ? 1 : -1)
