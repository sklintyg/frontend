import { Question } from '@frontend/common'
import { getNumberOfUnhandledQuestions, getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

describe('questionUtils', () => {
  describe('getNumberOfUnhandledQuestions', () => {
    it('returns correct number of unhandled questions if unhandled', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const questions: Question[] = [{ handled: true }, { handled: false }, { handled: false }]

      const expected = 2
      const actual = getNumberOfUnhandledQuestions(questions)

      expect(actual).toBe(expected)
    })

    it('returns correct number of unhandled questions if no unhandled', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const questions: Question[] = [{ handled: true }, { handled: true }, { handled: true }]

      const expected = 0
      const actual = getNumberOfUnhandledQuestions(questions)

      expect(actual).toBe(expected)
    })
  })
})
