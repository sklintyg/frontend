import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RenewCertificateButton from '../RenewCertificateButton'
import * as redux from 'react-redux'
import { CustomTooltip, User } from '@frontend/common/src'
import { CertificateMetadata } from '@frontend/common'

const NAME = 'Renew button name'
const DESCRIPTION = 'Renew button description'
const BODY = 'Renew button body'
const DONT_SHOW_FORNYA_DIALOG = 'wc.dontShowFornyaDialog'
const PREFERENCES = { [DONT_SHOW_FORNYA_DIALOG]: 'false' }
const user: User = {
  hsaId: '1234abc',
  name: 'Test Testtest',
  loggedInUnit: { unitName: 'testUnit' },
  loggedInCareProvider: { unitName: 'testProvider' },
  role: 'doctor',
  preferences: PREFERENCES,
}

//@ts-expect-error creating object so component renders
const certificateMetadata: CertificateMetadata = {}

const renderDefaultComponent = (enabled: boolean, functionDisabled = false) => {
  render(
    <>
      <RenewCertificateButton
        certificateId={certificateMetadata.id}
        name={NAME}
        description={DESCRIPTION}
        body={BODY}
        enabled={enabled}
        functionDisabled={functionDisabled}
      />
      <CustomTooltip />
    </>
  )
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useSelectorSpy.mockReturnValue(user)
  useDispatchSpy.mockReturnValue(jest.fn())
})

describe('Renew certificate button', () => {
  it('renders without crashing', () => {
    renderDefaultComponent(true)
  })

  it('correctly disables button', () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall disable button if disableFunction is true', () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('sets correct name for button', () => {
    renderDefaultComponent(true)
    const name = screen.queryByText(NAME)
    expect(name).not.toBeNull()
  })

  it('sets correct description for button', async () => {
    renderDefaultComponent(true)
    await userEvent.hover(screen.getByText(NAME))
    expect(screen.queryByText(DESCRIPTION)).not.toBeNull()
  })

  it('sets correct body for button', () => {
    renderDefaultComponent(true)
    const body = screen.queryByText(BODY)
    expect(body).toBeNull()
  })

  it('renders modal when button is clicked', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    expect(button).not.toBeDisabled()
    expect(screen.queryByText(BODY)).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    expect(screen.queryByText(BODY)).not.toBeNull()
  })

  it('allows user to interact with modal', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    const checkbox = screen.queryByRole('checkbox') as HTMLInputElement
    expect(checkbox).not.toBeNull()
    expect(checkbox).not.toBeChecked()
    userEvent.click(checkbox)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    expect(checkbox).toBeChecked()
    userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    userEvent.click(screen.getByText('Förnya'))
    expect(screen.queryByRole('dialog')).toBeNull()
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    userEvent.click(screen.getByText('Avbryt'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('does not show dialog if preference to hide renewal dialog is set', () => {
    user.preferences = { [DONT_SHOW_FORNYA_DIALOG]: 'true' }
    renderDefaultComponent(true)
    expect(screen.queryByRole('dialog')).toBeNull()
    userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
