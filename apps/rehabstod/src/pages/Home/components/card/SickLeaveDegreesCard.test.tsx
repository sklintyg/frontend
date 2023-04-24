import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { SickLeaveDegreesCard } from './SickLeaveDegreesCard'
import { fakeSickLeaveSummary } from '../../../../utils/fake/fakeSickLeave'

const renderComponent = () => {
  renderWithRouter(<SickLeaveDegreesCard summary={fakeSickLeaveSummary()} />)
}

describe('SickLeaveDegreesCard', () => {
  beforeEach(() => {})

  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('Aktuell sjukskrivningsgrad')).toBeInTheDocument()
  })

  it('should show sub title', () => {
    renderComponent()
    expect(screen.getByText('Andel sjukfall fördelat på sjukskrivningsgrad.')).toBeInTheDocument()
  })

  it('should show male sub title', () => {
    renderComponent()
    expect(screen.getByText('Män')).toBeInTheDocument()
  })

  it('should show female sub title', () => {
    renderComponent()
    expect(screen.getByText('Kvinnor')).toBeInTheDocument()
  })

  it('should show all graphs', () => {
    renderComponent()
    expect(screen.getAllByRole('region')).toHaveLength(1)
  })
})
