import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitForDomChange } from '@testing-library/react'
import AvailableForPatientStatus from './AvailableForPatientStatus'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import userEvent from '@testing-library/user-event'

it('displays that the certificate is available for the patient', async () => {
  const spy = jest.spyOn(utils, 'isSigned')

  spy.mockReturnValue(true)

  render(<AvailableForPatientStatus />)

  expect(screen.getByText(/intyget är tillgängligt för patienten/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/intyget är tillgängligt för patienten/i))

  expect(screen.getByRole('heading', { name: /intyget är tillgängligt för patienten/i })).toBeInTheDocument()
  expect(screen.getByText(/intyget är tillgängligt för patienten i mina intyg, som nås via/i)).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', { name: /stäng/i }))
  await waitForDomChange()
  expect(screen.queryByText(/intyget är tillgängligt för patienten i mina intyg, som nås via/i)).not.toBeInTheDocument()
})

it('doesnt render anything', async () => {
  const spy = jest.spyOn(utils, 'isSigned')

  spy.mockReturnValue(false)

  render(<AvailableForPatientStatus />)

  expect(screen.queryByText(/intyget är tillgängligt för patienten/i)).not.toBeInTheDocument()
})
