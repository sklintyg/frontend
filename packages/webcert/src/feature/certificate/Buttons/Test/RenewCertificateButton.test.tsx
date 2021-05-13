import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RenewCertificateButton from '../RenewCertificateButton'
import * as redux from 'react-redux'
import { User } from '@frontend/common/src'

const NAME = 'Renew button name'
const DESCRIPTION = 'Renew button description'
const BODY = 'Renew button body'
const PREFERENCES = { dontShowFornyaDialog: 'false' }
const user: User = {
  hsaId: '1234abc',
  name: 'Test Testtest',
  loggedInUnit: 'testUnit',
  loggedInCareProvider: 'testProvider',
  role: 'doctor',
  preferences: PREFERENCES,
}

const renderDefaultComponent = (enabled: boolean) => {
  render(<RenewCertificateButton name={NAME} description={DESCRIPTION} body={BODY} enabled={enabled} />)
}

beforeAll(() => {
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

  it('sets correct name and description for button', () => {
    renderDefaultComponent(true)
    const name = screen.queryByText(NAME)
    const description = screen.queryByText(DESCRIPTION)
    const body = screen.queryByText(BODY)
    expect(name).not.toBeNull()
    expect(description).not.toBeNull()
    expect(body).toBeNull()
  })

  it('renders modal when button is clicked', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button')
    expect(button).not.toBeDisabled()
    expect(screen.queryByText(BODY)).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    expect(screen.queryByText(BODY)).not.toBeNull()
  })

  it('allows user to interact with modal', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button')
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    const checkbox = screen.queryByRole('checkbox')
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
    user.preferences.dontShowFornyaDialog = 'true'
    renderDefaultComponent(true)
    userEvent.click(screen.queryByRole('button'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
