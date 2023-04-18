import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { fakeSickLeaveSummary } from '../../../../utils/fake/fakeSickLeave'
import { SickLeaveLengthsCard } from '../card/SickLeaveLengthsCard'

const renderComponent = () => {
  renderWithRouter(<SickLeaveLengthsCard summary={fakeSickLeaveSummary()} />)
}

describe('SickLeaveLengthsCard', () => {
  beforeEach(() => {})

  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('Sjukskrivningslängd')).toBeInTheDocument()
  })

  it('should show sub title', () => {
    renderComponent()
    expect(screen.getByText('Se hur många och hur stor procentsats av sjukfallen som har en viss sjukskrivningslängd.')).toBeInTheDocument()
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
    expect(screen.getAllByRole('region')).toHaveLength(3)
  })
})
