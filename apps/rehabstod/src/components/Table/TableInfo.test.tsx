import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { TableInfo } from './TableInfo'

const renderComponent = (showPersonalInformation: boolean, onShowPersonalInformationChange: () => void) => {
  render(
    <TableInfo
      listLength={10}
      totalNumber={20}
      showPersonalInformation={showPersonalInformation}
      onShowPersonalInformationChange={onShowPersonalInformationChange}
    >
      Children
    </TableInfo>
  )
}
describe('TableInfo', () => {
  it('should render without throwing errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render total number text', () => {
    renderComponent(false)
    expect(screen.getByText('Visar', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('10 av 20', { exact: false })).toBeInTheDocument()
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
