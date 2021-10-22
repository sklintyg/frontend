import { Question } from '@frontend/common'

export const getNumberOfUnhandledQuestions = (questions: Question[]): number => {
  const unhandledQuestions = questions.filter((question) => !question.handled)
  return unhandledQuestions.length > 0 ? unhandledQuestions.length : 0
}

export const getShouldComplementedBeActive = (administrativeQuestions: Question[], complementQuestions: Question[]): boolean => {
  if (areComplementAndAdministrativeEmpty(administrativeQuestions, complementQuestions)) return true
  if (doesComplementAndAdministrativeHaveUnhandledQuestions(administrativeQuestions, complementQuestions)) return true

  return onlyAdministrativeQuestionsAreUnhandled(administrativeQuestions, complementQuestions)
}

const areComplementAndAdministrativeEmpty = (administrativeQuestions: Question[], complementQuestions: Question[]) => {
  return (!administrativeQuestions || !administrativeQuestions.length) && (!complementQuestions || !complementQuestions.length)
}

const doesComplementAndAdministrativeHaveUnhandledQuestions = (administrativeQuestions: Question[], complementQuestions: Question[]) => {
  const unhandledComplementQuestions = getNumberOfUnhandledQuestions(complementQuestions)
  const unhandledAdministrativeQuestions = getNumberOfUnhandledQuestions(administrativeQuestions)

  return unhandledAdministrativeQuestions > 0 && unhandledComplementQuestions > 0
}

const onlyAdministrativeQuestionsAreUnhandled = (administrativeQuestions: Question[], complementQuestions: Question[]) => {
  return !(getNumberOfUnhandledQuestions(complementQuestions) === 0 && getNumberOfUnhandledQuestions(administrativeQuestions) > 0)
}
