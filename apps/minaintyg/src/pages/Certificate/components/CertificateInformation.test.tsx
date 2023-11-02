import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { certificateMetadataSchema } from '../../../schema/certificate.schema'
import { CertificateInformation } from './CertificateInformation'

function renderComponent(showEvents = true) {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    issuer: {
      name: 'Mats Andersson',
    },
    unit: {
      id: 'fac5103a-357b-4037-847e-eadf5866573a',
      name: 'Jansson, Lundqvist Kommanditbolag',
      address: 'Löfgrens Väg 262, 904 38 Båhamn',
      phoneNumber: '3226-91101',
    },
    events: [
      {
        timestamp: '2023-09-26T03:28:09.273Z',
        certificateId: 'commodi',
        description: 'Ersätter ett intyg som inte längre är aktuellt',
      },
    ],
    id: '39a4e3af-6f92-46d8-875f-4ca5ff96589f',
    issued: '2022-11-10T22:56:55.241Z',
    type: {
      id: 'ts-bas',
      name: 'Transportstyrelsens läkarintyg högre körkortsbehörighet',
      version: '1',
    },
    summary: {
      label: 'Avser diagnos',
      value: 'Downs syndrom',
    },
  })
  return render(
    <RouterProvider
      router={createMemoryRouter(
        createRoutesFromElements(<Route path="/" element={<CertificateInformation {...metadata} showEvents={showEvents} />} />)
      )}
    />
  )
}

it('Should render as expected', () => {
  const { container } = renderComponent()
  expect(screen.getByText(/ersätter ett intyg som inte längre är aktuellt/i)).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})

it('Should be possible to hide event information', () => {
  const { container } = renderComponent(false)
  expect(screen.queryByText(/ersätter ett intyg som inte längre är aktuellt/i)).not.toBeInTheDocument()
  expect(container).toMatchSnapshot()
})
