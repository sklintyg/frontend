import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { Filters } from './Filters'

describe('CurrentSickLeavesFilters', () => {
  beforeEach(() => {
    renderWithRouter(<Filters isDoctor={false} />)
  })

  it('should render without problems', () => {
    expect(() => renderWithRouter(<Filters isDoctor={false} />)).not.toThrow()
  })

  it('should show hide filters button', () => {
    expect(screen.getByText('Dölj sökfilter')).toBeInTheDocument()
  })

  it('should show buttons when filters are open', () => {
    expect(screen.getByText('Återställ')).toBeInTheDocument()
    expect(screen.getByText('Sök')).toBeInTheDocument()
  })

  it('should show show filters button after pressing hide', async () => {
    await userEvent.click(screen.getByText('Dölj sökfilter'))
    expect(screen.getByText('Visa sökfilter')).toBeInTheDocument()
  })
})
