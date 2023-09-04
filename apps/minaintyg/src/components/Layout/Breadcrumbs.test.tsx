import { render, screen } from '@testing-library/react'
import { Outlet, Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'

it('Should render breadcrumbs', () => {
  render(
    <RouterProvider
      router={createMemoryRouter(
        createRoutesFromChildren([
          <Route
            key="root"
            path="/"
            handle={{ crumb: () => 'Start' }}
            element={
              <div>
                <Breadcrumbs />
                <Outlet />
              </div>
            }
          >
            <Route index element={<p>Start</p>} />
            <Route path="/intyg" handle={{ crumb: () => 'Intyg' }}>
              <Route index element={<p>Certificates List</p>} />
              <Route
                path=":id"
                handle={{
                  crumb: ({ id }: { id: string }) => id,
                }}
                element={<p>Intyget</p>}
              />
            </Route>
          </Route>,
        ]),
        { initialEntries: ['/intyg/1234'] }
      )}
    />
  )

  expect(screen.getByRole('link', { name: 'Start' })).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Intyg' })).toHaveLength(2)
})
