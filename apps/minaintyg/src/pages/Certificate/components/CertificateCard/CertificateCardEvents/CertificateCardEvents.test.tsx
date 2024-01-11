import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { expect, it } from 'vitest'
import { CertificateCardEvents } from './CertificateCardEvents'
import { CertificateEvent, certificateEventSchema } from '../../../../../schema/certificate.schema'

function renderComponent(events: CertificateEvent[]) {
  return render(
    <RouterProvider
      router={createMemoryRouter(
        createRoutesFromElements(
          <Route path="/" element={<CertificateCardEvents events={events} heading={<h5 className="ids-heading-4 mb-0">Händelser</h5>} />} />
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
