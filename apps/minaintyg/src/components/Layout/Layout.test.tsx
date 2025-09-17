import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { endSession, startSession } from '../../store/slice/session.slice'
import { store } from '../../store/store'
import { Layout } from './Layout'
import { api } from '../../store/api'

beforeEach(async () => {
  store.dispatch(startSession())
  await store.dispatch(api.endpoints.getInfo.initiate())
})

it('Should render as expected', () => {
  const { container } = render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<Layout>Test</Layout>} />), { initialEntries: ['/'] })}
      />
    </Provider>
  )
  expect(container).toMatchSnapshot()
})

it('Should display session ended information', () => {
  store.dispatch(endSession({ reason: 'logged-out' }))
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<Layout>Test</Layout>} />), {
          initialEntries: ['/'],
        })}
      />
    </Provider>
  )
  expect(screen.getByRole('heading', { name: 'Du är utloggad', level: 1 })).toBeInTheDocument()
})
