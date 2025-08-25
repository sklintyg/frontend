import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { vi } from 'vitest'
import UvCareUnitAddress from './UvCareUnitAddress'
import type { CertificateMetadata } from '../../../types'

it('displays all care unit info', (): void => {
  const mockData = {
    issuedBy: {
      fullName: 'Test Testsson',
    },
    unit: {
      address: 'test street 123',
      city: 'Test city',
      phoneNumber: 'phone',
      zipCode: 'zipcode',
    },
  } as CertificateMetadata

  const mockEventData = [
    { timestamp: '2023-02-20' },
    { timestamp: '2023-02-21', type: 'SIGNED' },
    { timestamp: '2023-02-22', type: 'REVOKED' },
  ]
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  useSelectorSpy.mockReturnValueOnce(mockData).mockReturnValueOnce(mockEventData)

  render(<UvCareUnitAddress />)

  expect(screen.getByRole('heading', { name: /ovanstående uppgifter och bedömningar bekräftas/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /namn och kontaktuppgifter till vårdenheten/i })).toBeInTheDocument()
  expect(screen.getByText(/Test Testsson/i)).toBeInTheDocument()
  expect(screen.getByText(/test street 123/i)).toBeInTheDocument()
  expect(screen.getByText(/Test city/i)).toBeInTheDocument()
  expect(screen.getByText(/phone/i)).toBeInTheDocument()
  expect(screen.getByText(/zipcode/i)).toBeInTheDocument()
  expect(screen.getByText(/2023-02-21/)).toBeInTheDocument()
})

it('displays signed date from metadata if present', (): void => {
  const mockData = {
    issuedBy: {
      fullName: 'Test Testsson',
    },
    unit: {
      address: 'test street 123',
      city: 'Test city',
      phoneNumber: 'phone',
      zipCode: 'zipcode',
    },
    signed: '2023-02-20',
  } as CertificateMetadata

  const mockEventData = [
    { timestamp: '2023-02-20' },
    { timestamp: '2023-02-21', type: 'SIGNED' },
    { timestamp: '2023-02-22', type: 'REVOKED' },
  ]
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  useSelectorSpy.mockReturnValueOnce(mockData).mockReturnValueOnce(mockEventData)

  render(<UvCareUnitAddress />)

  expect(screen.getByText(/2023-02-20/)).toBeInTheDocument()
})
