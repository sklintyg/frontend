import React from 'react'
import { render, screen } from '@testing-library/react'
import { CertificateMetadata } from '@frontend/common'
import CertificateInfo from './CertificateInfo'

it('displays certificate name, patients name and date of birth', () => {
  const mockData: CertificateMetadata = {
    name: 'Test cert name',
    patient: { fullName: 'Tolvan', personId: { id: '123' } },
  }

  render(<CertificateInfo certificateMetadata={mockData} />)
  expect(screen.getByRole('heading', { name: /Test cert name/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /Tolvan - 123/i })).toBeInTheDocument()
})
