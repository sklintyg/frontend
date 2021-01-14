import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitForDomChange } from '@testing-library/react'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import RevokedStatus from './RevokedStatus'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

it('displays that the certificate is revoked', async () => {
  const isRevokedSpy = jest.spyOn(utils, 'isRevoked')

  isRevokedSpy.mockReturnValue(true)

  render(
    <BrowserRouter>
      <RevokedStatus />
    </BrowserRouter>
  )
  expect(screen.getByText(/intyget är makulerat/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/intyget är makulerat/i))

  expect(screen.getByRole('heading', { name: /intyget är makulerat/i })).toBeInTheDocument()
  expect(screen.getByText(/intyget är inte längre tillgängligt för patienten i mina intyg, som nås via/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /stäng/i })).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', { name: /stäng/i }))
  expect(screen.queryByText(/intyget är inte längre tillgängligt för patienten i mina intyg, som nås via/i)).not.toBeInTheDocument()
})

it('doesnt render anything', async () => {
  const isRevokedSpy = jest.spyOn(utils, 'isRevoked')

  isRevokedSpy.mockReturnValue(false)

  render(
    <BrowserRouter>
      <RevokedStatus />
    </BrowserRouter>
  )
  expect(screen.queryByText(/utkastet är sparat/i)).not.toBeInTheDocument()
})
