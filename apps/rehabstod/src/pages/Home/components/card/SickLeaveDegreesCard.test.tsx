import { screen } from '@testing-library/react'
import { expect, it, describe, beforeEach } from 'vitest'
import { SickLeaveDegreesCard } from './SickLeaveDegreesCard'
import { fakeSickLeaveSummary } from '../../../../utils/fake/fakeSickLeave'
import { renderWithRouter } from '../../../../utils/renderWithRouter'

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
    expect(screen.getByText('Sjukfall fördelat på aktuell sjukskrivningsgrad')).toBeInTheDocument()
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
