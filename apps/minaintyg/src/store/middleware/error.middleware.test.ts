import { waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server, waitForRequest } from '../../mocks/server'
import { api } from '../api'
import { startSession } from '../slice/session.slice'
import { store } from '../store'

it('Should add id to request errors', async () => {
  const { getUser } = api.endpoints
  server.use(
    rest.get('/api/user', (_, res, ctx) => res(ctx.status(500), ctx.json({ message: 'Some custom error message', status: 'CUSTOM_ERROR' })))
  )
  store.dispatch(getUser.initiate(undefined))
  await waitFor(() => expect(getUser.select(undefined)(store.getState()).isError).toBe(true))

  expect(getUser.select(undefined)(store.getState()).error).toEqual({
    status: 500,
    data: { message: 'Some custom error message', status: 'CUSTOM_ERROR' },
    id: expect.stringMatching(/.{8}-.{4}-.{4}-.{4}-.{12}/),
  })
})

it('Should log errors', async () => {
  const { getUser } = api.endpoints
  store.dispatch(startSession())
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(500), ctx.json({}))))
  const pendingLogRequest = waitForRequest('POST', '/api/log/error')

  store.dispatch(getUser.initiate(undefined))
  await waitFor(() => expect(getUser.select(undefined)(store.getState()).isError).toBe(true))

  const req = await pendingLogRequest
  expect(await req.json()).toEqual({
    code: 500,
    message: "'Rejected' method 'GET' url '/api/user'",
    id: expect.stringMatching(/.{8}-.{4}-.{4}-.{4}-.{12}/),
  })
})
