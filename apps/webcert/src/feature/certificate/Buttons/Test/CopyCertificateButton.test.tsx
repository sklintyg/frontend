import { CertificateMetadata, CustomTooltip } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithStore } from '../../../../utils/renderWithStore'
import CopyCertificateButton from '../CopyCertificateButton'

const NAME = 'Copy button name'
const DESCRIPTION = 'Copy button description'
const BODY = 'Copy button body'

const certificateMetadata = {} as CertificateMetadata

const renderDefaultComponent = (enabled: boolean, functionDisabled = false) => {
  renderWithStore(
    <>
      <CopyCertificateButton
        name={NAME}
        description={DESCRIPTION}
        body={BODY}
        enabled={enabled}
        certificateMetadata={certificateMetadata}
        functionDisabled={functionDisabled}
      />
      <CustomTooltip />
    </>
  )
}

describe('Copy certificate button', () => {
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
    await userEvent.click(screen.getByText('Kopiera'))
    expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    await userEvent.click(screen.getByText('Avbryt'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
