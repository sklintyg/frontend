import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { vi } from 'vitest'
import CustomTooltip from '../../../components/utils/CustomTooltip'
import CreateCertificateFromTemplateButton from './CreateCertificateFromTemplateButton'

const NAME = 'Template button name'
const DESCRIPTION = 'Template button description'
const BODY = 'Template button body'

// @ts-expect-error creating object so component renders
const certificateMetadata: CertificateMetadata = {}

const renderDefaultComponent = (enabled: boolean) => {
  render(
    <>
      <CustomTooltip />
      <CreateCertificateFromTemplateButton
        certificateMetadata={certificateMetadata}
        name={NAME}
        description={DESCRIPTION}
        body={BODY}
        enabled={enabled}
      />
    </>
  )
}

beforeEach(() => {
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(vi.fn())
})

describe('Create certificate from template button', () => {
  it('shall render without crashing', () => {
    expect(() => renderDefaultComponent(true)).not.toThrow()
  })

  it('shall disable button', async () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    await expect(button).toBeDisabled()
  })

  it('shall enable button', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button')
    await expect(button).toBeEnabled()
  })

  it('shall set name for button', () => {
    renderDefaultComponent(true)
    expect(screen.getByText(NAME)).toBeInTheDocument()
  })

  it('shall set description for button', async () => {
    renderDefaultComponent(true)
    await userEvent.hover(screen.getByText(NAME))
    expect(await screen.findByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('shall not show modal if button is not pressed', () => {
    renderDefaultComponent(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText(BODY)).not.toBeInTheDocument()
  })

  it('renders modal when button is clicked', async () => {
    renderDefaultComponent(true)
    await userEvent.click(screen.getByLabelText('Template button name'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(BODY)).toBeInTheDocument()
  })
})
