import { screen } from '@testing-library/react'
import { OverviewStatistics } from './OverviewStatistics'
import { renderWithRouter } from '../../../utils/renderWithRouter'

const renderComponent = () => {
  renderWithRouter(<OverviewStatistics />)
}

describe('OverviewStatistics', () => {
  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('Översikt över pågående sjukfall just nu')).toBeInTheDocument()
  })
})
