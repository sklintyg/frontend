import { IDSHeader } from '@frontend/ids-react-ts'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { expect, it } from 'vitest'
import { LayoutHeaderAvatar } from './LayoutHeaderAvatar'
import { store } from '../../store/store'

it('Should render links', async () => {
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromElements(
            <Route
              path="/"
              element={
                <IDSHeader>
                  <LayoutHeaderAvatar />
                </IDSHeader>
              }
            />
          ),
          {
            initialEntries: ['/'],
          }
        )}
      />
    </Provider>
  )
  expect(await screen.findByRole('link', { name: 'Inställningar' })).toBeInTheDocument()
  expect(await screen.findByRole('link', { name: 'Logga ut' })).toBeInTheDocument()
})

it('Should not render anything when user is not loaded', async () => {
  const { container } = render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromElements(
            <Route
              path="/"
              element={
                <IDSHeader>
                  <LayoutHeaderAvatar />
                </IDSHeader>
              }
            />
          ),
          {
            initialEntries: ['/'],
          }
        )}
      />
    </Provider>
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      <ids-header />
    </div>
  `)
})
