import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { updateHasSessionEnded } from '../../store/slice/session.slice'
import { store } from '../../store/store'
import { Layout } from './Layout'

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
  store.dispatch(updateHasSessionEnded(true))
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
