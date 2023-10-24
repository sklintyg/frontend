import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { certificateMetadataSchema } from '../../../schema/certificate.schema'
import { CertificateFooter } from './CertificateFooter'

const metadata = fakerFromSchema(certificateMetadataSchema)({
  issuer: {
    name: 'Arnold Johansson',
  },
  unit: {
    name: 'Alfa-enheten, Alfamottagningen',
    address: 'Gatuadressens väg 1',
    phoneNumber: '08-123 456 78',
    city: 'Storstaden',
    zipCode: '111 11',
  },
})
it('Should render issuerName', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    issuer: {
      name: 'Arnold Johansson',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText(`Arnold Johansson`)).toBeInTheDocument()
})

it('Should render unit phoneNumber', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    unit: {
      phoneNumber: '08-123 456 78',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText(`08-123 456 78`)).toBeInTheDocument()
})

it('Should only render unit name if matching careUnit name', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    unit: {
      name: 'Alfa-enheten',
    },
    careUnit: {
      name: 'Alfa-enheten',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText(`Alfa-enheten`)).toBeInTheDocument()
})

it('Should render unit name and careUnit name if not the same', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    unit: {
      name: 'Alfa-enheten',
    },
    careUnit: {
      name: 'Alfamottagningen',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText(`Alfa-enheten, Alfamottagningen`)).toBeInTheDocument()
})

it('Should render unit address', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    unit: {
      address: 'Gatuadressens väg 1',
      city: 'Storstaden',
      zipCode: '111 11',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText(`Gatuadressens väg 1, 111 11, Storstaden`)).toBeInTheDocument()
})
