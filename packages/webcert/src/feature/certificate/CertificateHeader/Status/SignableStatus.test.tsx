import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import SignableStatus from './SignableStatus'

it('displays that the certificate is not ready for signing', () => {
  const isUnsignedSpy = jest.spyOn(utils, 'isUnsigned')

  isUnsignedSpy.mockReturnValue(true)

  render(<SignableStatus isValidForSigning={false} />)
  expect(screen.getByText(/obligatoriska uppgifter saknas/i)).toBeInTheDocument()
})

it('displays that the certificate is ready for signing', () => {
  const isUnsignedSpy = jest.spyOn(utils, 'isUnsigned')

  isUnsignedSpy.mockReturnValue(true)

  render(<SignableStatus isValidForSigning={true} />)
  expect(screen.getByText(/klart att signera/i)).toBeInTheDocument()
})

it('doesnt render anything', () => {
  const isSignedSpy = jest.spyOn(utils, 'isSigned')

  isSignedSpy.mockReturnValue(false)

  render(<SignableStatus />)
  expect(screen.queryByText(/Intyget är skickat till/i)).not.toBeInTheDocument()
})
