import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { vi } from 'vitest'
import UvPatientAddress from './UvPatientAddress'
import type { CertificateMetadata } from '../../../types'

it('displays patient address info', (): void => {
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')

  const mockData = {
    patient: {
      street: 'test street 123',
      city: 'Test city',
      zipCode: 'zipcode',
    },
  } as CertificateMetadata

  useSelectorSpy.mockReturnValue(mockData)

  render(<UvPatientAddress />)

  expect(screen.getByText(/test street 123/i)).toBeInTheDocument()
  expect(screen.getByText(/Test city/i)).toBeInTheDocument()
  expect(screen.getByText(/zipcode/i)).toBeInTheDocument()
})
