import { fakerFromSchema } from '@frontend/fake'
import { expect, it } from 'vitest'
import { getDoctorsPlaceholder } from './getDoctorsPlaceholder'
import { lakareSchema } from '../../../../schemas/lakareSchema'

it('Should return Alla valda if nothing is selected', () => {
  const options = Array.from({ length: 3 }, fakerFromSchema(lakareSchema))
  expect(getDoctorsPlaceholder([], options)).toBe('Alla valda')
})

it('Should return name if one is selected', () => {
  const options = Array.from({ length: 3 }, fakerFromSchema(lakareSchema))
  expect(getDoctorsPlaceholder([options[0].hsaId], options)).toBe(options[0].namn)
})

it('Should return number of selected when more then one', () => {
  const options = Array.from({ length: 3 }, fakerFromSchema(lakareSchema))
  expect(getDoctorsPlaceholder([options[0].hsaId, options[1].hsaId], options)).toBe('2 valda')
})
