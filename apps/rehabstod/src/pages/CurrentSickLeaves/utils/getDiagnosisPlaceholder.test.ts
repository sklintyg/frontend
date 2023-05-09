import { fakerFromSchema } from '@frontend/fake'
import { diagnosKapitelSchema } from '../../../schemas/sickLeaveSchema'
import { getDiagnosisPlaceholder } from './getDiagnosisPlaceholder'

it('Should return undefined when nothing is selected', () => {
  expect(getDiagnosisPlaceholder([])).toBeUndefined()
})

it('Should return name when one is selected', () => {
  const diagnosChapter = fakerFromSchema(diagnosKapitelSchema)()
  expect(getDiagnosisPlaceholder([diagnosChapter])).toBe(`${diagnosChapter.id}: ${diagnosChapter.name} `)
})

it('Should return number of selected when more then one', () => {
  expect(getDiagnosisPlaceholder(Array.from({ length: 2 }, fakerFromSchema(diagnosKapitelSchema)))).toBe('2 valda')
})
