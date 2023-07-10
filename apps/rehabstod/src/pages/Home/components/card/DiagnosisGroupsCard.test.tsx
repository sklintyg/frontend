import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { fakeSickLeaveSummary } from '../../../../utils/fake/fakeSickLeave'
import { DiagnosisGroupsCard } from './DiagnosisGroupsCard'

const renderComponent = () => {
  renderWithRouter(<DiagnosisGroupsCard summary={fakeSickLeaveSummary()} />)
}

describe('DiagnosisGroupsCard', () => {
  beforeEach(() => {})

  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('Diagnosgrupp')).toBeInTheDocument()
  })

  it('should show sub title', () => {
    renderComponent()
    expect(screen.getByText('Sjukfall fördelat på diagnosgrupp.')).toBeInTheDocument()
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
