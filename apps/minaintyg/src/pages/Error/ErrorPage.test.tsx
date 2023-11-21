import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { waitForRequest } from '../../mocks/server'
import { startSession } from '../../store/slice/session.slice'
import { store } from '../../store/store'
import { ErrorPage } from './ErrorPage'

it('Should log error', async () => {
  const pendingLogRequest = waitForRequest('POST', '/api/log/error')
  store.dispatch(startSession())
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromElements(<Route path="/error/:type/:id" element={<ErrorPage />} />), {
          initialEntries: ['/error/asdasd/1234'],
        })}
      />
    </Provider>
  )

  const logRequest = await pendingLogRequest
  expect(await logRequest.json()).toMatchObject({
    code: 'CUSTOM_ERROR',
    id: '1234',
    message: 'NO_MESSAGE',
  })
})

it('Should log login-failed error', async () => {
  const pendingLogRequest = waitForRequest('POST', '/api/log/error')
  store.dispatch(startSession())
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromElements(<Route path="/error/:type/:id" element={<ErrorPage />} />), {
          initialEntries: ['/error/login-failed/1234'],
        })}
      />
    </Provider>
  )

  const logRequest = await pendingLogRequest
  expect(await logRequest.json()).toMatchObject({
    code: 'LOGIN_FAILED',
    id: '1234',
    message: 'NO_MESSAGE',
  })
})
