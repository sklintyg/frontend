import { Question } from '@frontend/common'
import { getNumberOfUnhandledQuestions, getShouldComplementedBeActive } from './questionUtils'

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

  describe('getShouldComplementedBeActive', () => {
    it('shall return true if both administrative and complement are empty', () => {
      const administrativeQuestions: Question[] = []
      const complementQuestions: Question[] = []

      const expected = true
      const actual = getShouldComplementedBeActive(administrativeQuestions, complementQuestions)
      expect(actual).toBe(expected)
    })

    it('shall return true if both administrative and complement have unhandled questions', () => {
      const administrativeQuestions: Question[] = [{ handled: false }]
      const complementQuestions: Question[] = [{ handled: false }]

      const expected = true
      const actual = getShouldComplementedBeActive(administrativeQuestions, complementQuestions)
      expect(actual).toBe(expected)
    })

    it('shall return false if only administrative has unhandled questions', () => {
      const administrativeQuestions: Question[] = [{ handled: false }]
      const complementQuestions: Question[] = [{ handled: true }]

      const expected = false
      const actual = getShouldComplementedBeActive(administrativeQuestions, complementQuestions)
      expect(actual).toBe(expected)
    })

    it('shall return false if there are only administrative questions', () => {
      const administrativeQuestions: Question[] = [{ handled: false }]
      const complementQuestions: Question[] = []

      const expected = false
      const actual = getShouldComplementedBeActive(administrativeQuestions, complementQuestions)
      expect(actual).toBe(expected)
    })
  })
})
