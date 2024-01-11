import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { expect, it } from 'vitest'
import { Layout } from './Layout'
import { endSession } from '../../store/slice/session.slice'
import { store } from '../../store/store'

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
