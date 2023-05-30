import { fakerFromSchema } from '@frontend/fake'
import { occupationType } from '../../../schemas/sickLeaveSchema'
import { getOccupationPlaceholder } from './getOccupationPlaceholder'

it('Should return Alla valda if nothing is selected', () => {
  const options = Array.from({ length: 3 }, fakerFromSchema(occupationType))
  expect(getOccupationPlaceholder([], options)).toBe('Alla valda')
})

it('Should return name if one is selected', () => {
  const options = Array.from({ length: 3 }, fakerFromSchema(occupationType))
  expect(getOccupationPlaceholder([options[0].id], options)).toBe(options[0].name)
})

it('Should return number of selected when more then one', () => {
  const options = Array.from({ length: 3 }, fakerFromSchema(occupationType))
  expect(getOccupationPlaceholder([options[0].id, options[1].id], options)).toBe('2 valda')
})
