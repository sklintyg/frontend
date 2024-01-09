import { act, render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../mocks/server'
import { api } from '../store/api'
import { store } from '../store/store'
import { fakeUser } from '../utils/fake/fakeUser'
import { useSession } from './useSession'

function StartPage() {
  const { session, isLoading, isPollingActive } = useSession()
  if (isLoading) {
    return <span>Loading</span>
  }
  if (!isPollingActive) {
    return <span>Polling inactive</span>
  }
  return (
    <div>
      <span>Start</span>
      <pre>{JSON.stringify(session, null, 4)}</pre>
    </div>
  )
}

function TestComponent() {
  return (
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([<Route path="/" element={<StartPage />} />, <Route path="/welcome" element="Welcome" />])
        )}
      />
    </Provider>
  )
}

it('Should logout once the session is over', async () => {
  server.use(
    rest.get(`/api/user`, (_, res, ctx) =>
      res(ctx.status(200), ctx.json(fakeUser({ pdlConsentGiven: true, authenticationScheme: 'urn:inera:rehabstod:siths:fake' })))
    )
  )
  store.dispatch(api.endpoints.getUser.initiate())

  render(<TestComponent />)

  expect(screen.getByText('Loading')).toBeInTheDocument()

  expect(await screen.findByText('Start')).toBeInTheDocument()

  act(() => {
    store.dispatch(
      api.util.updateQueryData('getSessionPing', undefined, () => ({
        hasSession: false,
        secondsUntilExpire: 0,
        authenticated: false,
      }))
    )
  })

  expect(await screen.findByText('Welcome')).toBeInTheDocument()
})
