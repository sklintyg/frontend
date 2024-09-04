import { render } from '@testing-library/react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { LayoutHeader } from './LayoutHeader'
import { LayoutHeaderNavigation } from './LayoutHeaderNavigation'

it('Should render correctly', () => {
  const { container } = render(
    <RouterProvider
      router={createMemoryRouter(
        createRoutesFromElements(
          <Route
            path="/"
            element={
              <LayoutHeader mode="development">
                <LayoutHeaderNavigation mode="development" />
              </LayoutHeader>
            }
          />
        )
      )}
    />
  )
  expect(container).toMatchSnapshot()
})

it('Should not crash outside router context', () => {
  const { container } = render(<LayoutHeaderNavigation mode="development" />)
  expect(container).toBeEmptyDOMElement()
})
