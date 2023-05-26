import { CustomTooltip } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { replaceCertificate, showSpinner } from '../../../../store/certificate/certificateActions'
import { renderWithStore } from '../../../../utils/renderWithStore'
import ReplaceCertificateButton from '../ReplaceCertificateButton'

const NAME = 'Replace button name'
const DESCRIPTION = 'Replace button description'

const renderDefaultComponent = (enabled: boolean) => {
  return renderWithStore(
    <>
      <CustomTooltip />
      <ReplaceCertificateButton name={NAME} description={DESCRIPTION} enabled={enabled} functionDisabled={false} />
    </>
  )
}

describe('Replace continue button', () => {
  it('shall enable button when enabled is true', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button')
    expect(button).toBeEnabled()
  })

  it('shall disable button when enabled is false', () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall set the name passed as prop', () => {
    renderDefaultComponent(true)
    const name = screen.queryByText(NAME)
    expect(name).not.toBeNull()
  })

  it('shall set the description passed as prop', async () => {
    renderDefaultComponent(true)
    await userEvent.hover(screen.getByText(NAME))
    const description = screen.queryByText(DESCRIPTION)
    expect(description).not.toBeNull()
  })

  it('shall open modal when clicked', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
  })

  it("shall dispatch replace certificate when dialog button 'replace' is clicked", async () => {
    const { getCalledActions, clearCalledActions } = renderDefaultComponent(true)
    clearCalledActions()
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Ersätt'))
    expect(getCalledActions()).toContainEqual({ type: replaceCertificate.type, payload: undefined })
    expect(getCalledActions()).toContainEqual({ type: showSpinner.type, payload: 'Ersätter...' })
  })

  it("shall not dispatch replace certificate when dialog button 'cancelled' is clicked", async () => {
    const { getCalledActions, clearCalledActions } = renderDefaultComponent(true)
    clearCalledActions()
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Avbryt'))
    expect(getCalledActions()).toHaveLength(0)
  })
})
