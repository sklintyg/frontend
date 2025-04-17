import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { store } from './store/store'

function renderComponent(initialEntries: string[]) {
  return render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries })} />
    </Provider>
  )
}

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
