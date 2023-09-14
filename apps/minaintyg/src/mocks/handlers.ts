/* eslint-disable import/no-extraneous-dependencies */

import { fakerFromSchema } from '@frontend/fake'
import { rest } from 'msw'
import { userSchema } from '../schema/user.schema'

export const handlers = [rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(userSchema)())))]
