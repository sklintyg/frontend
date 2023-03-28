import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { CurrentSickLeavesFilters } from './CurrentSickLeavesFilters'

let onSearch
let onReset
let onShow
const renderComponent = () => {
  onSearch = vi.fn()
  onReset = vi.fn()
  onShow = vi.fn()

  render(<CurrentSickLeavesFilters onSearch={onSearch} onReset={onReset} onShowPersonalInformation={onShow} />)
}

describe('CurrentSickLeavesFilters', () => {
  beforeEach(() => {
    renderComponent()
  })

  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show hide filters button', () => {
    expect(screen.getByText('Dölj sökfilter')).toBeInTheDocument()
  })

  it('should show buttons when filters are open', () => {
    expect(screen.getByText('Återställ')).toBeInTheDocument()
    expect(screen.getByText('Sök')).toBeInTheDocument()
  })

  it('should show hide personal information when filters are open', () => {
    expect(screen.getByText('Visa personuppgifter')).toBeInTheDocument()
  })

  it('should check hide personal information checkbox as default', () => {
    const checkbox = screen.getByLabelText('Visa personuppgifter')
    expect(checkbox).toBeChecked()
  })

  it('should uncheck hide personal information checkbox when clicked', () => {
    const checkbox = screen.getByLabelText('Visa personuppgifter')
    userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('should show show filters button after pressing hide', () => {
    userEvent.click(screen.getByText('Dölj sökfilter'))
    expect(screen.getByText('Visa sökfilter')).toBeInTheDocument()
  })
})
