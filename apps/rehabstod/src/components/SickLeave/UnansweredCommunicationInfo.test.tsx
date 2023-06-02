import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { UnansweredCommunicationInfo } from './UnansweredCommunicationInfo'

const renderComponent = (complements: number, others: number) => {
  renderWithRouter(<UnansweredCommunicationInfo complements={complements} others={others} />)
}

describe('UnansweredCommunicationInfo', () => {
  it('should render without issues', () => {
    expect(() => renderComponent(0, 0)).not.toThrow()
  })

  it('should render dash if both are zero', () => {
    renderComponent(0, 0)
    expect(screen.getByText('-')).toBeInTheDocument()
    expect(screen.queryByText('Komplettering')).not.toBeInTheDocument()
    expect(screen.queryByText('Administrativ fråga')).not.toBeInTheDocument()
  })

  it('should render only complements if others are zero', () => {
    renderComponent(5, 0)
    expect(screen.getByText('Komplettering (5)')).toBeInTheDocument()
    expect(screen.queryByText('Administrativ fråga')).not.toBeInTheDocument()
  })

  it('should render only others if complements are zero', () => {
    renderComponent(0, 10)
    expect(screen.queryByText('Komplettering')).not.toBeInTheDocument()
    expect(screen.getByText('Administrativ fråga (10)')).toBeInTheDocument()
  })

  it('should render both if non zero', () => {
    renderComponent(10, 20)
    expect(screen.getByText('Komplettering (10)')).toBeInTheDocument()
    expect(screen.getByText('Administrativ fråga (20)')).toBeInTheDocument()
  })
})
