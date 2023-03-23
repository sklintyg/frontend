/* eslint-disable import/no-extraneous-dependencies */
import { generateMock } from '@anatine/zod-mock'
import { linkSchema, Ping, pingSchema, User, userSchema } from '@frontend/types'
import { rest } from 'msw'

const seed = 1234

export const handlers = [
  rest.get(`/api/user`, async (_, res, ctx) => res(ctx.status(200), ctx.json(generateMock(userSchema, { seed })))),
  rest.get<User>('/api/links', async (_, res, ctx) => res(ctx.status(200), ctx.json(generateMock(linkSchema, { seed })))),
  rest.get<Ping>('/api/session-auth-check/ping', async (_, res, ctx) => res(ctx.status(200), ctx.json(generateMock(pingSchema, { seed })))),
  rest.post<{ id: string }>('/api/user/andraenhet', async (_, res, ctx) =>
    res(ctx.status(200), ctx.json(generateMock(userSchema, { seed })))
  ),
]
