import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { GenderDivisionGraph } from './GenderDivisionGraph'

const genders = [
  {
    gender: 'F',
    percentage: 40,
    count: 40,
  },
  {
    gender: 'M',
    percentage: 60,
    count: 60,
  },
]

const renderComponent = () => {
  renderWithRouter(<GenderDivisionGraph genders={genders} />)
}

describe('GenderDivisionGraph', () => {
  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render title', () => {
    renderComponent()
    expect(screen.getByText('Könsfördelning totalt')).toBeInTheDocument()
  })

  it('should render male icon', () => {
    renderComponent()
    expect(screen.getByTestId('iconMale')).toBeInTheDocument()
  })

  it('should render female icon', () => {
    renderComponent()
    expect(screen.getByTestId('iconFemale')).toBeInTheDocument()
  })

  it('should render percentages', () => {
    renderComponent()
    expect(screen.getByText('40 %')).toBeInTheDocument()
    expect(screen.getByText('60 %')).toBeInTheDocument()
  })
})
