import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { CertificateFooter } from './CertificateFooter'
import { certificateMetadataSchema } from '../../../schema/certificate.schema'

it('Should render issuerName', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    issuer: {
      name: 'Arnold Johansson',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText('Arnold Johansson')).toBeInTheDocument()
})

it('Should render unit phoneNumber', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    unit: {
      phoneNumber: '08-123 456 78',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText('08-123 456 78')).toBeInTheDocument()
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
  expect(screen.getByText('Alfa-enheten')).toBeInTheDocument()
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
  expect(screen.getByText('Alfa-enheten, Alfamottagningen')).toBeInTheDocument()
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
  expect(screen.getByText('Gatuadressens väg 1, 111 11 Storstaden')).toBeInTheDocument()
})

it('Should render partial unit address without zipCode', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    unit: {
      address: 'Gatuadressens väg 1',
      city: 'Storstaden',
      zipCode: '',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText('Gatuadressens väg 1 Storstaden')).toBeInTheDocument()
})

it('Should render partial unit address without address', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    unit: {
      address: '',
      city: 'Storstaden',
      zipCode: '111 11',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText('111 11 Storstaden')).toBeInTheDocument()
})

it('Should render partial unit address without city', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    unit: {
      address: 'Gatuadressens väg 1',
      city: '',
      zipCode: '111 11',
    },
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText('Gatuadressens väg 1, 111 11')).toBeInTheDocument()
})

it('Should render certificate id', () => {
  const metadata = fakerFromSchema(certificateMetadataSchema)({
    id: 'some-certificate-identification',
  })

  render(<CertificateFooter {...metadata} />)
  expect(screen.getByText('some-certificate-identification')).toBeInTheDocument()
})
