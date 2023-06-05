import { expect, it } from 'vitest'
import { z } from 'zod'
import { fakerFromSchema } from '.'

it('Should generate a faker function from schema', () => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  })

  const fakePerson = fakerFromSchema(schema, { seed: 1 })

  expect(fakePerson()).toEqual({ firstName: 'Rosemarie', lastName: 'Stamm' })
})

it('Should be able to write partial data', () => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  })

  const fakePerson = fakerFromSchema(schema, { seed: 1 })

  expect(fakePerson({ lastName: 'Smith' })).toEqual({ firstName: 'Rosemarie', lastName: 'Smith' })
})

it('Should be possible to override mock', () => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  })

  const fakePerson = fakerFromSchema(schema, {
    seed: 1,
    stringMap: {
      lastName: () => 'Andersson',
    },
  })

  expect(fakePerson()).toEqual({ firstName: 'Rosemarie', lastName: 'Andersson' })
})
