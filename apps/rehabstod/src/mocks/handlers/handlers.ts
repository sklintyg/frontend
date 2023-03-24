/* eslint-disable import/no-extraneous-dependencies */
import { fakerFromSchema, fakeUser } from '@frontend/fake'
import { linkSchema, Ping, User } from '@frontend/types'
import { rest } from 'msw'

export const handlers = [
  rest.get(`/api/user`, async (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get<User>('/api/links', async (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        link: fakerFromSchema(linkSchema)(),
      })
    )
  ),

  rest.post<{ id: string }>('/api/user/andraenhet', async (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get<Ping>('/api/session-auth-check/ping', async (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        hasSession: true,
        secondsUntilExpire: 1800,
        authenticated: true,
      })
    )
  ),
]
