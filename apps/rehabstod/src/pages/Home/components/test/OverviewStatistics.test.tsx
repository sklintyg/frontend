import { OverviewStatistics } from '../OverviewStatistics'
import { renderWithRouter } from '../../../../utils/renderWithRouter'

const renderComponent = () => {
  renderWithRouter(<OverviewStatistics />)
}

describe('OverviewStatistics', () => {
  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })
})
