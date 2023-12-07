import { act, render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { server, waitForRequest } from './mocks/server'
import { routes } from './routes'
import { startSession } from './store/slice/session.slice'
import { store } from './store/store'

function renderComponent(initialEntries: string[]) {
  return render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries })} />
    </Provider>
  )
}

it.each([
  ['Du är utloggad', 403],
  ['Tjänsten är inte tillgänglig just nu', 503],
  ['Någonting gick fel', 504],
] as const)('Should display %s when request status is %s', async (headline, status) => {
  store.dispatch(startSession())
  server.use(rest.post('/api/certificate', (_, res, ctx) => res(ctx.status(status))))
  const pendingUserRequest = waitForRequest('GET', '/api/user')
  const pendingCertificateListRequest = waitForRequest('POST', '/api/certificate')
  const pendingLogRequest = waitForRequest('POST', '/api/log/error')

  renderComponent(['/'])

  await act(async () => pendingUserRequest)
  await act(async () => pendingCertificateListRequest)

  const logRequest = await pendingLogRequest
  expect(await logRequest.json()).toMatchObject({
    code: status,
    id: '5f92e947-e2ee-4238-bf29-4cdc6b6c4b54',
    message: "'Rejected' method 'POST' url '/api/certificate'",
  })

  expect(store.getState().sessionSlice.hasSession).toBe(false)
  expect(store.getState().sessionSlice.hasSessionEnded).toBe(true)

  expect(await screen.findByRole('heading', { name: headline, level: 1 })).toBeInTheDocument()
})

it('Should end session when visiting /logga-ut', async () => {
  renderComponent(['/logga-ut'])

  expect(await screen.findByRole('heading', { name: 'Du är utloggad', level: 1 })).toBeInTheDocument()
  expect(store.getState().sessionSlice.hasSessionEnded).toBe(true)
  await waitFor(() => expect(document.title).toBe('Du är utloggad - 1177'))
})

it('Should update document title for certificate list', async () => {
  renderComponent(['/'])
  await waitFor(() => expect(document.title).toBe('Intyg - 1177'))
})

it('Should update document title for certificate page', async () => {
  renderComponent(['/1234'])
  await waitFor(() => expect(document.title).toBe('Läs och hantera ditt intyg - 1177'))
})

it('Should update document title for send certificate page', async () => {
  renderComponent(['/1234/skicka'])
  await waitFor(() => expect(document.title).toBe('Skicka intyg - 1177'))
})
