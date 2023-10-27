import { CertificateMetadata, CustomTooltip, Unit, User } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithStore } from '../../../../utils/renderWithStore'
import RenewCertificateButton from '../RenewCertificateButton'

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
  renderWithStore(
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

describe('Renew certificate button', () => {
  it('renders without crashing', () => {
    expect(() => renderDefaultComponent(true)).not.toThrow()
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

  it('renders modal when button is clicked', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    expect(button).not.toBeDisabled()
    expect(screen.queryByText(BODY)).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    expect(screen.queryByText(BODY)).not.toBeNull()
  })

  it('allows user to interact with modal', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    const checkbox = screen.queryByRole('checkbox') as HTMLInputElement
    expect(checkbox).not.toBeNull()
    expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    await userEvent.click(screen.getByText('Förnya'))
    expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    await userEvent.click(screen.getByText('Avbryt'))
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
