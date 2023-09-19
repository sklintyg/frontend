/* eslint-disable import/no-extraneous-dependencies */

import { fakerFromSchema } from '@frontend/fake'
import { rest } from 'msw'
import { testabilityPersonSchema } from '../schema/testability/person.schema'
import { userSchema } from '../schema/user.schema'

export const handlers = [
  rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(userSchema)()))),

  rest.post('/api/testability/fake', (_, res, ctx) => res(ctx.status(200))),

  rest.get('/api/testability/person', (_, res, ctx) =>
    res(ctx.json({ testPerson: Array.from({ length: 10 }, fakerFromSchema(testabilityPersonSchema)) }))
  ),
]
