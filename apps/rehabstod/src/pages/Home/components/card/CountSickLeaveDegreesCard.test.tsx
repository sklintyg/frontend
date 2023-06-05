import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { fakeSickLeaveSummary } from '../../../../utils/fake/fakeSickLeave'
import { CountSickLeaveDegreesCard } from './CountSickLeaveDegreesCard'

const renderComponent = () => {
  renderWithRouter(<CountSickLeaveDegreesCard summary={fakeSickLeaveSummary()} />)
}

describe('CountSickLeaveDegreesCard', () => {
  beforeEach(() => {})

  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('Fler än en sjukskrivningsgrad')).toBeInTheDocument()
  })

  it('should show sub title', () => {
    renderComponent()
    expect(screen.getByText('Andel sjukfall som har fler än en sjukskrivningsgrad.')).toBeInTheDocument()
  })

  it('should show male sub title', () => {
    renderComponent()
    expect(screen.getByText('Män')).toBeInTheDocument()
  })

  it('should show female sub title', () => {
    renderComponent()
    expect(screen.getByText('Kvinnor')).toBeInTheDocument()
  })
})
