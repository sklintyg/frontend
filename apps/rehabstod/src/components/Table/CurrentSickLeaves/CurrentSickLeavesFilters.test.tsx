import { render, screen } from '@testing-library/react'
import { CurrentSickLeaves } from '../../../pages/CurrentSickLeaves/CurrentSickLeaves'
import userEvent from '@testing-library/user-event'

const renderComponent = () => {
  return render(<CurrentSickLeaves />)
}

describe('CurrentSickLeavesFilters', () => {
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
})
