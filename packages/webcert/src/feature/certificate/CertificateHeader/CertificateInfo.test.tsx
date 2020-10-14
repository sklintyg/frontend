import React from 'react'
import { render, screen } from '@testing-library/react'
import { CertificateMetadata } from '@frontend/common'
import CertificateInfo from './CertificateInfo'

it('displays certificate name, patients name and date of birth', (): void => {
  const mockData: CertificateMetadata = {
    certificateName: 'Test cert name',
    // @ts-expect-error: We don't need to fill the whole object with data
    patient: { fullName: 'Tolvan', personId: '123' },
  }

  render(<CertificateInfo certificateMetadata={mockData} />)
  screen.getByRole('heading', { name: /Test cert name/i })
  screen.getByRole('heading', { name: /Tolvan - 123/i })
})
