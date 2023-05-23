import { act, screen } from '@testing-library/react'
import { format } from 'date-fns'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { TotalSickLeavesGraph } from './TotalSickLeavesGraph'

describe('TotalSickLeavesGraph', () => {
  it('should render without errors', () => {
    expect(() => renderWithRouter(<TotalSickLeavesGraph total={5} />)).not.toThrow()
  })

  it('should show title', () => {
    renderWithRouter(<TotalSickLeavesGraph total={5} />)
    expect(screen.getByText('Antal sjukfall')).toBeInTheDocument()
  })

  it('should show tooltip', async () => {
    const { user } = renderWithRouter(<TotalSickLeavesGraph total={5} />)
    await act(() => user.hover(screen.getByTestId('tooltipIcon')))
    expect(screen.getByText(`Antal sjukfall just nu, ${format(new Date(), 'yyyy-MM-dd, HH:mm')}`)).toBeInTheDocument()
  })
})
