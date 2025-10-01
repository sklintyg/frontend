import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { waitForRequest } from '../../mocks/server'
import { api } from '../../store/api'
import { store } from '../../store/store'
import { ErrorBoundary } from './ErrorBoundary'

it('Should log client error for active session', async () => {
  const pendingLogRequest = waitForRequest('POST', '/api/log/error')
  store.dispatch(api.endpoints.getUser.initiate())
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromElements(<Route path="/" errorElement={<ErrorBoundary />} element="Test" />), {
          initialEntries: ['/'],
          hydrationData: {
            errors: {
              '0': new Error('A error message'),
            },
          },
        })}
      />
    </Provider>
  )

  const logRequest = await pendingLogRequest
  expect(await logRequest.json()).toMatchObject({
    code: 'CLIENT_ERROR',
    id: expect.any(String),
    message: 'A error message',
    stackTrace: expect.stringContaining('Error: A error message'),
  })
})
