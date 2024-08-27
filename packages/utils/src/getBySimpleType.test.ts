import { expect, it } from 'vitest'
import { getBySimpleType } from './getBySimpleType'

it('Should get object based on type', () => {
  const expected = { type: 'some type', foo: 'bar' }
  expect(getBySimpleType([expected], expected.type)).toBe(expected)
})
