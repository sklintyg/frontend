import { expect, it } from 'vitest'
import { tryCatch } from './tryCatch'

it('Should capture error', () => {
  expect(tryCatch(() => JSON.parse('{'))).toMatchObject([undefined, new SyntaxError('Unexpected end of JSON input')])
})

it('Should pass on result', () => {
  expect(tryCatch(() => JSON.parse('{"foo": "bar"}'))).toMatchObject([{ foo: 'bar' }, undefined])
})
