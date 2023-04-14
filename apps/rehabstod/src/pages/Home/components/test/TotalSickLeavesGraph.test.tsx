import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { TotalSickLeavesGraph } from '../TotalSickLeavesGraph'

const renderComponent = () => {
  renderWithRouter(<TotalSickLeavesGraph total={5} />)
}

describe('TotalSickLeavesGraph', () => {
  beforeEach(() => {})

  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('Antal sjukfall')).toBeInTheDocument()
  })

  it('should show total graph', () => {
    renderComponent()
    expect(screen.getByRole('region')).toBeInTheDocument()
  })
})
