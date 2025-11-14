import { render, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { api } from '../../../store/api'
import { store } from '../../../store/store'
import { LayoutFooter } from './LayoutFooter'

it('Should render footer as expected', async () => {
  store.dispatch(api.endpoints.getLinks.initiate())

  await waitFor(() => expect(api.endpoints.getLinks.select()(store.getState()).isSuccess).toBe(true))

  const { container } = render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<LayoutFooter />} />))} />
    </Provider>
  )

  expect(container).toMatchSnapshot()
})
