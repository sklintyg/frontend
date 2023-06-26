import { getUnansweredCommunicationFormat } from './getUnansweredCommunicationFormat'

it('Should return - when there is no data', () => {
  expect(getUnansweredCommunicationFormat(0, 0)).toBe('-')
})

it('Should return "Komplettering" when there are unanswered complement', () => {
  expect(getUnansweredCommunicationFormat(1, 0)).toBe('Komplettering (1)')
})

it('Should return "Administrativ fråga" when there are unanswered others', () => {
  expect(getUnansweredCommunicationFormat(0, 1)).toBe('Administrativ fråga (1)')
})

it('Should return both with new line', () => {
  expect(getUnansweredCommunicationFormat(10, 10)).toBe('Komplettering (10)\nAdministrativ fråga (10)')
})
