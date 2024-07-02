import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { beforeEach, expect, vi } from 'vitest'
import CustomTooltip from '../../../components/utils/CustomTooltip'
import type { CertificateMetadata, Unit, User } from '../../../types'
import RenewCertificateButton from './RenewCertificateButton'

const NAME = 'Renew button name'
const DESCRIPTION = 'Renew button description'
const BODY = 'Renew button body'
const DONT_SHOW_FORNYA_DIALOG = 'wc.dontShowFornyaDialog'
const PREFERENCES = { [DONT_SHOW_FORNYA_DIALOG]: 'false' }
const user = {
  hsaId: '1234abc',
  name: 'Test Testtest',
  loggedInUnit: { unitName: 'testUnit' } as Unit,
  loggedInCareProvider: { unitName: 'testProvider' } as Unit,
  role: 'doctor',
  preferences: PREFERENCES,
} as unknown as User

const certificateMetadata = {} as CertificateMetadata

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
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useSelectorSpy.mockReturnValue(user)
  useDispatchSpy.mockReturnValue(vi.fn())
})

describe('Renew certificate button', () => {
  it('renders without crashing', () => {
    expect(() => renderDefaultComponent(true)).not.toThrow()
  })

  it('correctly disables button', async () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    await expect(button).toBeDisabled()
  })

  it('shall disable button if disableFunction is true', async () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    await expect(button).toBeDisabled()
  })

  it('sets correct name for button', () => {
    renderDefaultComponent(true)
    const name = screen.queryByText(NAME)
    expect(name).toBeInTheDocument()
  })

  it('sets correct description for button', async () => {
    renderDefaultComponent(true)
    await userEvent.hover(screen.getByText(NAME))
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('sets correct body for button', () => {
    renderDefaultComponent(true)
    const body = screen.queryByText(BODY)
    expect(body).not.toBeInTheDocument()
  })

  it('renders modal when button is clicked', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    await expect(button).toBeEnabled()
    expect(screen.queryByText(BODY)).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(BODY)).toBeInTheDocument()
  })

  it('allows user to interact with modal', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const checkbox = screen.queryByRole('checkbox') as HTMLInputElement
    expect(checkbox).toBeInTheDocument()
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(screen.getByText('Förnya'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Avbryt'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not show dialog if preference to hide renewal dialog is set', async () => {
    user.preferences = { [DONT_SHOW_FORNYA_DIALOG]: 'true' }
    renderDefaultComponent(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
