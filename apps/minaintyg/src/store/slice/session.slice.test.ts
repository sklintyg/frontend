import { waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { api } from '../api'
import { store } from '../store'
import { selectHasSession, selectHasSessionEnded } from './session.slice'

it('Session should be disable by default', () => {
  expect(store.getState().sessionSlice.hasSession).toBe(false)
})

it('Session should not be marked as ended by default', () => {
  expect(store.getState().sessionSlice.hasSessionEnded).toBe(false)
})

it('Should mark session as started once user request is fulfilled', async () => {
  const { getUser } = api.endpoints
  store.dispatch(getUser.initiate())
  await waitFor(() => expect(getUser.select(undefined)(store.getState()).isSuccess).toBe(true))
  await waitFor(() => expect(selectHasSession(store.getState())).toBe(true))
})

it.each([403, 503, 504] as const)('Should end session for failed request with status %s', async (status) => {
  const { getUser, getCertificates } = api.endpoints
  server.use(rest.post('/api/certificate', (_, res, ctx) => res(ctx.status(status), ctx.json({}))))

  store.dispatch(getUser.initiate())
  await waitFor(() => expect(getUser.select(undefined)(store.getState()).isSuccess).toBe(true))
  await waitFor(() => expect(selectHasSessionEnded(store.getState())).toBe(false))
  await waitFor(() => expect(selectHasSession(store.getState())).toBe(true))

  store.dispatch(getCertificates.initiate({}))
  await waitFor(() => expect(selectHasSessionEnded(store.getState())).toBe(true))
  await waitFor(() => expect(selectHasSession(store.getState())).toBe(false))
})
