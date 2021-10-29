import { Question } from '@frontend/common'
import { getNumberOfUnhandledQuestions, getShouldComplementedBeActive, getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

describe('questionUtils', () => {
  describe('getNumberOfUnhandledQuestions', () => {
    it('returns correct number of unhandled questions', () => {
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

      const expected = undefined
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

  describe('getQuestionsOrderedByLastUpdatedAndHandled', () => {
    it('orders questions correctly after last update', () => {
      const questions: Question[] = [
        { lastUpdate: '2021-10-20T13:01:00.000', id: '1' },
        { lastUpdate: '2021-10-20T13:05:00.000', id: '2' },
        { lastUpdate: '2021-10-20T13:10:00.000', id: '3' },
      ]

      const expected = [...questions.reverse()]
      const actual = getQuestionsOrderedByLastUpdatedAndHandled(questions)

      expect(actual[0].id).toEqual(expected[0].id)
      expect(actual[1].id).toEqual(expected[1].id)
      expect(actual[2].id).toEqual(expected[2].id)
    })

    it('orders questions correctly after handled', () => {
      const questions: Question[] = [
        { lastUpdate: '2021-10-20T13:10:00.000', handled: false, id: '1' },
        { lastUpdate: '2021-10-20T13:10:00.000', handled: false, id: '2' },
        { lastUpdate: '2021-10-20T13:10:00.000', handled: true, id: '3' },
      ]

      const actual = getQuestionsOrderedByLastUpdatedAndHandled(questions)

      expect(actual[0].id).toBe('3')
      expect(actual[0].handled).toBe(true)
    })

    it('orders questions correctly after last update and handled', () => {
      const questions: Question[] = [
        { lastUpdate: '2021-10-20T13:10:00.000', handled: true, id: '1' },
        { lastUpdate: '2021-10-20T13:30:00.000', handled: true, id: '2' },
        { lastUpdate: '2021-10-20T13:50:00.000', handled: false, id: '3' },
      ]

      const actual = getQuestionsOrderedByLastUpdatedAndHandled(questions)

      expect(actual[0].id).toBe('2')
      expect(actual[1].id).toBe('1')
      expect(actual[2].id).toBe('3')
    })
  })
})
