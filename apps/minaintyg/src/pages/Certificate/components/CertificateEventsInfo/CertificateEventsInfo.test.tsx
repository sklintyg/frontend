import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import type { CertificateEvent} from '../../../../schema/certificate.schema';
import { certificateEventSchema } from '../../../../schema/certificate.schema'
import { CertificateEventsInfo } from './CertificateEventsInfo'

function renderComponent(events: CertificateEvent[]) {
  return render(
    <RouterProvider
      router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<CertificateEventsInfo events={events} />} />))}
    />
  )
}

it('Should display information when there are no events', () => {
  renderComponent([])
  expect(screen.getByText('Inga händelser')).toBeInTheDocument()
})

it('Should link to certificate when there is a certificateId', () => {
  renderComponent([fakerFromSchema(certificateEventSchema)({ certificateId: '12345', description: 'Ersatt' })])
  expect(screen.getByRole('link', { name: 'Ersatt' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Ersatt' })).toHaveAttribute('href', '/12345')
})
