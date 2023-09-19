import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { store } from '../../store/store'
import { Layout } from './Layout'

it('Should render as expected', () => {
  const { baseElement } = render(
    <Provider store={store}>
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
    </Provider>
  )
  expect(baseElement).toMatchSnapshot()
})
