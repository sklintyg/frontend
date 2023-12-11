import { expect, it } from 'vitest'
import { omit } from './omit'

it('Should omit properties from object', () => {
  expect(omit({ a: '1', b: '2', c: '3' }, ['a', 'b'])).toEqual({ c: '3' })
})
