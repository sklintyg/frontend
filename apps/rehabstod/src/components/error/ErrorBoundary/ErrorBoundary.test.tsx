import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { expect, it } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { waitForRequest } from '../../../mocks/server'
import { store } from '../../../store/store'

it('Should display error message', async () => {
  const pendingRequest = waitForRequest('POST', '/api/log/error')
  const router = createMemoryRouter(
    createRoutesFromElements(<Route path="/" errorElement={<ErrorBoundary />} Component={() => <h1>Home</h1>} />),
    {
      initialEntries: ['/'],
      hydrationData: {
        errors: {
          '0': new Error('Broken!'),
        },
      },
    }
  )

  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )

  const request = await pendingRequest

  expect(screen.queryByText('Home')).not.toBeInTheDocument()
  expect(screen.getByText('Broken!')).toBeInTheDocument()

  expect(await request.json()).toMatchObject({ errorData: { message: 'Broken!' } })
})
