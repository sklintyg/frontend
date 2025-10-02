import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { StatisticsInformationCard } from './StatisticsInformationCard'

const renderComponent = () => {
  renderWithRouter(<StatisticsInformationCard />)
}

describe('StatisticsInformationCard', () => {
  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('Använd Intygsstatistik för att se mer statistik')).toBeInTheDocument()
  })

  it('should show text', () => {
    renderComponent()
    expect(screen.getByText('När du klickar på länken nedan öppnas Intygsstatistik i en ny flik.')).toBeInTheDocument()
  })
})
