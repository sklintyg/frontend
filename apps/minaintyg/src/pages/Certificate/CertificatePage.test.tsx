import { faker } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { store } from '../../store/store'
import { CertificatePage } from './CertificatePage'

beforeEach(() => {
  faker.seed(1234123)
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/:id" element={<CertificatePage />} />]), {
          initialEntries: ['/12345'],
        })}
      />
    </Provider>
  )
})

it('Should have article content', async () => {
  expect(await screen.findByRole('article')).toMatchSnapshot()
})
