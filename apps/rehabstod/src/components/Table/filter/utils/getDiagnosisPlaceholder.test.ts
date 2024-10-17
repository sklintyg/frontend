import { fakerFromSchema } from 'fake'
import { getDiagnosisPlaceholder } from './getDiagnosisPlaceholder'
import { diagnosKapitelSchema } from '../../../../schemas/diagnosisSchema'

it('Should return Alla valda when nothing is selected', () => {
  expect(getDiagnosisPlaceholder([])).toBe('Alla valda')
})

it('Should return name when one is selected', () => {
  const diagnosChapter = fakerFromSchema(diagnosKapitelSchema)()
  expect(getDiagnosisPlaceholder([diagnosChapter])).toBe(`${diagnosChapter.id}: ${diagnosChapter.name} `)
})

it('Should return number of selected when more then one', () => {
  expect(getDiagnosisPlaceholder(Array.from({ length: 2 }, fakerFromSchema(diagnosKapitelSchema)))).toBe('2 valda')
})
