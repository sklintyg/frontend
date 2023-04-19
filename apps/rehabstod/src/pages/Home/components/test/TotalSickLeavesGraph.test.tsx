import { screen } from '@testing-library/react'
import { format } from 'date-fns'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { TotalSickLeavesGraph } from '../graph/TotalSickLeavesGraph'

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

  it('should show tooltip', async () => {
    renderComponent()
    await userEvent.hover(screen.getByTestId('tooltipIcon'))
    expect(screen.getByText(`Antal sjukfall just nu, ${format(new Date(), 'yyyy-MM-dd, HH:mm')}`)).toBeInTheDocument()
  })
})
