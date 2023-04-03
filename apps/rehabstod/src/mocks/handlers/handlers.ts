/* eslint-disable import/no-extraneous-dependencies */
import { fakerFromSchema } from '@frontend/fake'
import { rest } from 'msw'
import { Link, linkSchema } from '../../schemas'
import { fakeUser } from '../../utils/fake'

const fakeLink = fakerFromSchema(linkSchema)

export const handlers = [
  rest.post('/logout', (req, res, ctx) => res(ctx.status(302))),

  rest.get(`/api/user`, (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get('/api/config/links', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json<Record<string, Link>>({
        ineraManualRehabstod: fakeLink({ text: 'ineraManualRehabstod' }),
        ineraNationellKundservice: fakeLink({ text: 'ineraNationellKundservice' }),
        ineraMainPage: fakeLink({ text: 'ineraMainPage' }),
        ineraPersonuppgifter: fakeLink({ text: 'ineraPersonuppgifter' }),
      })
    )
  ),

  rest.post<{ id: string }>('/api/user/andraenhet', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get('/api/session-auth-check/ping', (_, res, ctx) =>
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
