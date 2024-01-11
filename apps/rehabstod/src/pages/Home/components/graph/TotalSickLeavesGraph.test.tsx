import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import { expect, it, describe, beforeEach } from 'vitest'
import { TotalSickLeavesGraph } from './TotalSickLeavesGraph'
import { renderWithRouter } from '../../../../utils/renderWithRouter'

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

  it('should show tooltip', async () => {
    renderComponent()
    await userEvent.hover(screen.getByTestId('tooltipIcon'))
    expect(screen.getByText(`Antal sjukfall just nu, ${format(new Date(), 'yyyy-MM-dd, HH:mm')}`)).toBeInTheDocument()
  })
})
