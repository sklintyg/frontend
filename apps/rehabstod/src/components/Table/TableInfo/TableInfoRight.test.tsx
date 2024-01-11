import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, describe, vi } from 'vitest'
import { TableInfoRight } from './TableInfoRight'

const renderComponent = (showPersonalInformation: boolean, onShowPersonalInformationChange?: () => void) => {
  render(
    <TableInfoRight showPersonalInformation={showPersonalInformation} onShowPersonalInformationChange={onShowPersonalInformationChange}>
      Children
    </TableInfoRight>
  )
}
describe('TableInfo', () => {
  it('should render without throwing errors', () => {
    expect(() => renderComponent(true)).not.toThrow()
  })

  it('should not show personal information checkbox if onChange is not included', () => {
    renderComponent(false)
    expect(screen.queryByLabelText('Visa personuppgifter')).not.toBeInTheDocument()
  })

  it('should show personal information checkbox if onChange is included', () => {
    renderComponent(false, vi.fn())
    expect(screen.getByLabelText('Visa personuppgifter')).toBeInTheDocument()
  })

  it('should check checkbox if show personal information is true', () => {
    renderComponent(true, vi.fn())
    expect(screen.getByLabelText('Visa personuppgifter')).toBeChecked()
  })

  it('should not check checkbox if show personal information is false', () => {
    renderComponent(false, vi.fn())
    expect(screen.getByLabelText('Visa personuppgifter')).not.toBeChecked()
  })

  it('should call on show personal information when clicking checkbox', async () => {
    const onShowPersonalInformationChange = vi.fn()
    renderComponent(false, onShowPersonalInformationChange)
    await userEvent.click(screen.getByLabelText('Visa personuppgifter'))
    expect(onShowPersonalInformationChange).toHaveBeenCalledWith(true)
  })

  it('should render children', () => {
    renderComponent(false)
    expect(screen.getByText('Children')).toBeInTheDocument()
  })
})
