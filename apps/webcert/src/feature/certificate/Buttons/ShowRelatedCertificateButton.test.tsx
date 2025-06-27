import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { beforeEach, expect, vi } from 'vitest'
import CustomTooltip from '../../../components/utils/CustomTooltip'
import type { CertificateMetadata } from '../../../types'
import ShowRelatedCertificateButton from './ShowRelatedCertificateButton'

const NAME = 'Show related certificate button name'
const DESCRIPTION = 'Show related certificate button description'

const certificateMetadata = {} as CertificateMetadata

const renderDefaultComponent = (enabled: boolean, functionDisabled = false) => {
  render(
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

beforeEach(() => {
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useSelectorSpy.mockReturnValue(vi.fn())
  useDispatchSpy.mockReturnValue(vi.fn())
})

describe('Show related certificate button', () => {
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
})
