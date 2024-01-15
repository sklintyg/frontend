import { waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { api } from '../api'
import { store } from '../store'

it('Session should be disable by default', () => {
  expect(store.getState().sessionSlice.hasSession).toBe(false)
})

it('Session should not be marked as ended by default', () => {
  expect(store.getState().sessionSlice.hasSessionEnded).toBe(false)
})

it('Should mark session as started once user request is fulfilled', async () => {
  store.dispatch(api.endpoints.getUser.initiate())
  await waitFor(() => expect(api.endpoints.getUser.select(undefined)(store.getState()).isSuccess).toBe(true))
  await waitFor(() => expect(store.getState().sessionSlice.hasSession).toBe(true))
})

it.each([403, 503, 504] as const)('Should end session for failed request with stauts %s', async (status) => {
  server.use(rest.post('/api/certificate', (_, res, ctx) => res(ctx.status(status), ctx.json({}))))

  store.dispatch(api.endpoints.getUser.initiate())
  await waitFor(() => expect(api.endpoints.getUser.select(undefined)(store.getState()).isSuccess).toBe(true))
  await waitFor(() => expect(store.getState().sessionSlice.hasSession).toBe(true))

  store.dispatch(api.endpoints.getCertificates.initiate({}))
  await waitFor(() => expect(api.endpoints.getCertificates.select({})(store.getState()).isError).toBe(true))
  await waitFor(() => expect(store.getState().sessionSlice.hasSessionEnded).toBe(true))
  await waitFor(() => expect(store.getState().sessionSlice.hasSession).toBe(false))
})
