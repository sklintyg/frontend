import { act, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { waitForRequest } from '../../../mocks/server'
import { store } from '../../../store/store'
import { LayoutHeader } from './LayoutHeader'

it('Should render links when user is loaded', async () => {
  const userRequest = waitForRequest('GET', '/api/user')

  const { container } = render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<LayoutHeader />} />), { initialEntries: ['/'] })}
      />
    </Provider>
  )

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ids-header
        class="z-40 bg-white print:hidden"
      />
    </div>
  `)

  await act(async () => userRequest)

  expect(screen.getAllByRole('link')).toMatchSnapshot()
})
