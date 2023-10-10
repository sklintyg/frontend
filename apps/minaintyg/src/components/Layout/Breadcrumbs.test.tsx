import { render, screen } from '@testing-library/react'
import { Outlet, Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'

function renderComponent() {
  return render(
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
}

it('Should render starting link', () => {
  renderComponent()
  expect(screen.getByRole('link', { name: 'Start' })).toBeInTheDocument()
})

it('Should render intyg link twice (mobile and desktop)', () => {
  renderComponent()
  expect(screen.getAllByRole('link', { name: 'Intyg' })).toHaveLength(2)
})
