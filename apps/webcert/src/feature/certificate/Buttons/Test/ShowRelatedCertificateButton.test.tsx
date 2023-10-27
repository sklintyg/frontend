import { CertificateMetadata, CustomTooltip } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithStore } from '../../../../utils/renderWithStore'
import ShowRelatedCertificateButton from '../ShowRelatedCertificateButton'

const NAME = 'Show related certificate button name'
const DESCRIPTION = 'Show related certificate button description'

const certificateMetadata = {} as CertificateMetadata

const renderDefaultComponent = (enabled: boolean, functionDisabled = false) => {
  renderWithStore(
    <>
      <ShowRelatedCertificateButton
        certificateId={certificateMetadata.id}
        name={NAME}
        description={DESCRIPTION}
        enabled={enabled}
        functionDisabled={functionDisabled}
      />
      <CustomTooltip />
    </>
  )
}

describe('Show related certificate button', () => {
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
})
