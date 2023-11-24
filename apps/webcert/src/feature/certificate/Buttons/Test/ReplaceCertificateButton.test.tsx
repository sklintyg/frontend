import { CustomTooltip } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { vi } from 'vitest'
import ReplaceCertificateButton from '../ReplaceCertificateButton'

const NAME = 'Replace button name'
const DESCRIPTION = 'Replace button description'

let mockDispatchFn = vi.fn()

const renderDefaultComponent = (enabled: boolean) => {
  render(
    <>
      <CustomTooltip />
      <ReplaceCertificateButton name={NAME} description={DESCRIPTION} enabled={enabled} functionDisabled={false} />
    </>
  )
}

describe('Replace continue button', () => {
  beforeEach(() => {
    mockDispatchFn = vi.fn()
    const useSelectorSpy = vi.spyOn(redux, 'useSelector')
    useSelectorSpy.mockReturnValue({})

    const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)
  })

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
    expect(name).toBeInTheDocument()
  })

  it('shall set the description passed as prop', async () => {
    renderDefaultComponent(true)
    await userEvent.hover(screen.getByText(NAME))
    const description = screen.queryByText(DESCRIPTION)
    expect(description).toBeInTheDocument()
  })

  it('shall open modal when clicked', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it("shall dispatch replace certificate when dialog button 'replace' is clicked", async () => {
    renderDefaultComponent(true)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Ersätt'))
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })

  it("shall not dispatch replace certificate when dialog button 'cancelled' is clicked", async () => {
    renderDefaultComponent(true)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Avbryt'))
    expect(mockDispatchFn).toHaveBeenCalledTimes(0)
  })
})
