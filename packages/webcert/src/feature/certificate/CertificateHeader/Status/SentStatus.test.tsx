import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import SentStatus from './SentStatus'

it('displays that the certificate is sent', () => {
  const isSignedSpy = jest.spyOn(utils, 'isSigned')
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')

  isSignedSpy.mockReturnValue(true)
  isReplacedSpy.mockReturnValue(false)

  render(<SentStatus />)
  expect(screen.getByText(/Intyget är skickat till/i)).toBeInTheDocument()
})

it('doesnt render anything', () => {
  const isSignedSpy = jest.spyOn(utils, 'isSigned')

  isSignedSpy.mockReturnValue(false)

  render(<SentStatus />)
  expect(screen.queryByText(/Intyget är skickat till/i)).not.toBeInTheDocument()
})
