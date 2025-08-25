import { Heading } from '@frontend/components'
import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import type { CertificateEvent } from '../../../../../schema/certificate.schema'
import { certificateEventSchema } from '../../../../../schema/certificate.schema'
import { CertificateCardEvents } from './CertificateCardEvents'

function renderComponent(events: CertificateEvent[]) {
  return render(
    <RouterProvider
      router={createMemoryRouter(
        createRoutesFromElements(
          <Route
            path="/"
            element={
              <CertificateCardEvents
                events={events}
                heading={
                  <Heading level={5} size="xs" className="mb-0">
                    Händelser
                  </Heading>
                }
              />
            }
          />
        )
      )}
    />
  )
}

it('Should render correctly', () => {
  const events = [fakerFromSchema(certificateEventSchema, { seed: 1 })({ timestamp: '2023-09-06T11:00:00.000Z' })]
  const { container } = renderComponent(events)
  expect(screen.getAllByRole('heading', { level: 5 })).toHaveLength(2)
  expect(container).toMatchSnapshot()
})
