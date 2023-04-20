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
    expect(screen.getByText('Här kan du hitta mer statistik')).toBeInTheDocument()
  })

  it('should show text', () => {
    renderComponent()
    expect(
      screen.getByText(
        'Om du vill se mer statistik för din enhet eller på nationell nivå kan du använda Intygsstatistik. När du klickar på länken nedan öppnas Intygsstatistik i en ny flik, och du blir automatiskt inloggad om du har giltig behörighet till Intygsstatistik.'
      )
    ).toBeInTheDocument()
  })
})
