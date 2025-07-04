import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { beforeEach, expect, vi } from 'vitest'
import CustomTooltip from '../../../components/utils/CustomTooltip'
import type { CertificateMetadata } from '../../../types'
import CopyCertificateButton from './CopyCertificateButton'

const NAME = 'Copy button name'
const DESCRIPTION = 'Copy button description'
const BODY = 'Copy button body'

const certificateMetadata = {} as CertificateMetadata

const renderDefaultComponent = (enabled: boolean, functionDisabled = false) => {
  render(
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

beforeEach(() => {
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(vi.fn())
})

describe('Copy certificate button', () => {
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
    expect(await screen.findByText(DESCRIPTION)).toBeInTheDocument()
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
    await userEvent.click(screen.getByText('Kopiera'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Avbryt'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
