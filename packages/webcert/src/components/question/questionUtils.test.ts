import { Question } from '@frontend/common'
import { getNumberOfUnhandledQuestions, getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

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
  })

  describe('getQuestionsOrderedByLastUpdatedAndHandled', () => {
    it('orders questions correctly after last update', () => {
      const questions: Question[] = [
        { lastUpdate: '2021-10-20T13:10:00.000', id: '1' },
        { lastUpdate: '2021-10-20T13:05:00.000', id: '2' },
        { lastUpdate: '2021-10-20T13:01:00.000', id: '3' },
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
