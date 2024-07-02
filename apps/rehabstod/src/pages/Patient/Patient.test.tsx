import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import type { ReactNode } from 'react'
import { I18nProvider } from 'react-aria'
import { Provider } from 'react-redux'
import { createMemoryRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'
import { server } from '../../mocks/server'
import { store } from '../../store/store'
import { Patient } from './Patient'

function PatientWrapper({ children }: { children: ReactNode }) {
  const router = createMemoryRouter(createRoutesFromChildren([<Route key="root" path="/:encryptedPatientId" element={children} />]), {
    initialEntries: ['/12121212'],
  })
  return (
    <I18nProvider locale="sv-SE">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </I18nProvider>
  )
}

it('Should display error message when failing to fetch patient information', async () => {
  server.use(rest.post('/api/sjukfall/patient', (_, res, ctx) => res(ctx.status(400))))
  render(
    <PatientWrapper>
      <Patient activeTab="0" />
    </PatientWrapper>
  )
  expect(await screen.findByText(/information kan inte visas på grund av ett tekniskt fel/i)).toBeInTheDocument()
})
