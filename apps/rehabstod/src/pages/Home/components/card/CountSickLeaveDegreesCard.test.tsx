import { screen } from '@testing-library/react'
import { expect, it, describe, beforeEach } from 'vitest'
import { CountSickLeaveDegreesCard } from './CountSickLeaveDegreesCard'
import { fakeSickLeaveSummary } from '../../../../utils/fake/fakeSickLeave'
import { renderWithRouter } from '../../../../utils/renderWithRouter'

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
    expect(screen.getByText('Flera sjukskrivningsgrader')).toBeInTheDocument()
  })

  it('should show sub title', () => {
    renderComponent()
    expect(screen.getByText('Sjukfall fördelat på om aktuellt intyg innehåller en eller flera sjukskrivningsgrader')).toBeInTheDocument()
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
