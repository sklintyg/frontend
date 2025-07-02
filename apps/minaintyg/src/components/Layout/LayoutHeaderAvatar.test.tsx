import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { store } from '../../store/store'
import { LayoutHeaderAvatar } from './LayoutHeaderAvatar'

it('Should render links', async () => {
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<LayoutHeaderAvatar />} />), {
          initialEntries: ['/'],
        })}
      />
    </Provider>
  )
  expect(await screen.findByRole('link', { name: 'Inställningar' })).toBeInTheDocument()
  expect(await screen.findByRole('link', { name: 'Logga ut' })).toBeInTheDocument()
})

it('Should not render anything when user is not loaded', async () => {
  const { container } = render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<LayoutHeaderAvatar />} />), {
          initialEntries: ['/'],
        })}
      />
    </Provider>
  )
  expect(container).toBeEmptyDOMElement()
})
