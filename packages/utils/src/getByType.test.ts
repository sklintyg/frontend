import { expect, it } from 'vitest'
import { getByType } from './getByType'

it('Should get object based on type', () => {
  const expected = { type: 'some type', foo: 'bar' }
  expect(getByType([expected], expected.type)).toBe(expected)
})
