import React from 'react'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import UvCareUnitAddress from './UvCareUnitAddress'
import { CertificateMetadata } from '@frontend/common'

it('displays all care unit info', (): void => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')

  const mockData: CertificateMetadata = {
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
  }

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
