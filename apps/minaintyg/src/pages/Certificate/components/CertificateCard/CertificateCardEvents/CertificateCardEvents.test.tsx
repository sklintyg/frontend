import { fakerFromSchema } from '@frontend/fake'
import { render } from '@testing-library/react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { CertificateEvent, certificateEventSchema } from '../../../../../schema/certificate.schema'
import { CertificateCardEvents } from './CertificateCardEvents'

function renderComponent(events: CertificateEvent[]) {
  return render(
    <RouterProvider
      router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<CertificateCardEvents events={events} />} />))}
    />
  )
}

it('Should render correctly', () => {
  const events = [fakerFromSchema(certificateEventSchema, { seed: 1 })({ timestamp: '2023-09-06T11:00:00.000Z' })]
  const { container } = renderComponent(events)
  expect(container).toMatchSnapshot()
})
