import { render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { server } from '../../mocks/server'
import { store } from '../../store/store'
import { ProtectedRoute } from './ProtectedRoute'

function renderComponent() {
  return render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromElements(<Route key="root" path="/" element={<ProtectedRoute>content</ProtectedRoute>} />),
          {
            initialEntries: ['/'],
          }
        )}
      />
    </Provider>
  )
}

it('Should not render children while loading', async () => {
  const { container } = renderComponent()

  expect(container).toBeEmptyDOMElement()
})

it('Should render children when user is available', async () => {
  renderComponent()
  expect(await screen.findByText('content')).toBeInTheDocument()
})

it('Should redirect to saml login when unable to load user', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(500))))
  const openSpy = vi.spyOn(window, 'open')

  renderComponent()

  await waitFor(() => {
    expect(openSpy).toHaveBeenCalledWith('/saml2/authenticate/eleg', '_self')
  })
})
