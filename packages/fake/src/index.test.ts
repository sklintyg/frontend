import { expect, it } from 'vitest'
import { z } from 'zod'
import { fakerFromSchema } from '.'

it('Should generate a faker function from schema', () => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  })

  const fakePerson = fakerFromSchema(schema, { seed: 1 })

  expect(fakePerson()).toEqual({ firstName: 'Mina', lastName: 'Champlin' })
})

it('Should be able to write partial data', () => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  })

  const fakePerson = fakerFromSchema(schema, { seed: 1 })

  expect(fakePerson({ lastName: 'Smith' })).toEqual({ firstName: 'Mina', lastName: 'Smith' })
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

  expect(fakePerson()).toEqual({ firstName: 'Mina', lastName: 'Andersson' })
})

it('Should be able to handle seed when called multiple times', () => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  })

  const fakePerson = fakerFromSchema(schema, { seed: 1 })

  expect(fakePerson({ lastName: 'Smith' })).toEqual({ firstName: 'Mina', lastName: 'Smith' })
  expect(fakePerson({ lastName: 'Smith' })).toEqual({ firstName: 'Caesar', lastName: 'Smith' })
})
