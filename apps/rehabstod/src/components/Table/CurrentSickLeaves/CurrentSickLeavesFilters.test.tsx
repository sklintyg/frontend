import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { CurrentSickLeavesFilters } from './CurrentSickLeavesFilters'

let onSearch: () => void
let onReset: () => void
let onShow: () => void
const renderComponent = () => {
  onSearch = vi.fn()
  onReset = vi.fn()
  onShow = vi.fn()

  render(<CurrentSickLeavesFilters onSearch={onSearch} onReset={onReset} />)
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

  it('should show show filters button after pressing hide', () => {
    userEvent.click(screen.getByText('Dölj sökfilter'))
    expect(screen.getByText('Visa sökfilter')).toBeInTheDocument()
  })

  it('should call on search when pressing search button', () => {
    userEvent.click(screen.getByText('Sök'))
    expect(onSearch).toHaveBeenCalledTimes(1)
  })
})
