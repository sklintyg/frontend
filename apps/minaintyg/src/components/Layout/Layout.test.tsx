import { render } from '@testing-library/react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { Layout } from './Layout'

it('Should render as expected', () => {
  const { baseElement } = render(
    <RouterProvider
      router={createMemoryRouter(
        createRoutesFromChildren([
          <Route key="root" path="/" element={<Layout />}>
            <Route index element={<p>FooBar</p>} />
          </Route>,
        ]),
        { initialEntries: ['/'] }
      )}
    />
  )
  expect(baseElement).toMatchSnapshot()
})
