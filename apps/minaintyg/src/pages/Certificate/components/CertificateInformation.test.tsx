import { fakerFromSchema } from '@frontend/fake'
import { render } from '@testing-library/react'
import { certificateMetadataSchema } from '../../../schema/certificate.schema'
import { CertificateInformation } from './CertificateInformation'

it('Should render as expected', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    issuer: {
      name: 'Mats Andersson',
      phoneNumber: '3226-91101',
    },
    unit: {
      id: 'fac5103a-357b-4037-847e-eadf5866573a',
      name: 'Jansson, Lundqvist Kommanditbolag',
      address: 'Löfgrens Väg 262, 904 38 Båhamn',
    },
    events: [
      {
        timestamp: '2023-09-26T03:28:09.273Z',
        certificateId: 'commodi',
        description: 'Ersätter ett intyg som inte längre är aktuellt',
      },
    ],
    statuses: ['REPLACED', 'SENT'],
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
  const { baseElement } = render(<CertificateInformation {...metadata} />)
  expect(baseElement).toMatchSnapshot()
})
