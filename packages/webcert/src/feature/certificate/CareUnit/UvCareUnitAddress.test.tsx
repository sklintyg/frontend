import { CertificateMetadata } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { expect, it, vi } from 'vitest'
import UvCareUnitAddress from './UvCareUnitAddress'

it('displays all care unit info', (): void => {
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')

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
    created: '2020-10-12',
  } as CertificateMetadata

  useSelectorSpy.mockReturnValue(mockData)

  render(<UvCareUnitAddress />)

  expect(screen.getByRole('heading', { name: /ovanstående uppgifter och bedömningar bekräftas/i })).toBeInTheDocument()
  expect(screen.getByText(/2020-10-12/i)).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /namn och kontaktuppgifter till vårdenheten/i })).toBeInTheDocument()
  expect(screen.getByText(/Test Testsson/i)).toBeInTheDocument()
  expect(screen.getByText(/test street 123/i)).toBeInTheDocument()
  expect(screen.getByText(/Test city/i)).toBeInTheDocument()
  expect(screen.getByText(/phone/i)).toBeInTheDocument()
  expect(screen.getByText(/zipcode/i)).toBeInTheDocument()
})
