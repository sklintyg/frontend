import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { RiskSignalInfo } from './RiskSignalInfo'
import { RiskSignal } from '../../schemas/sickLeaveSchema'

const renderComponent = (riskSignal: RiskSignal) => {
  renderWithRouter(<RiskSignalInfo riskSignal={riskSignal} />)
}

const getRiskSignal = (category: number | null) => ({
  riskDescription: 'description',
  riskKategori: category,
  intygsId: 'id',
  berakningsTidpunkt: '2020-02-02',
})
describe('RiskSignalInfo', () => {
  it('should render without issues', () => {
    expect(() => renderComponent(getRiskSignal(1))).not.toThrow()
  })

  it('should render three risk signal rings', () => {
    renderComponent(getRiskSignal(1))
    expect(screen.getAllByTestId('riskSignalRing')).toHaveLength(3)
  })

  it('should render one colored ring and two white for category 1', () => {
    renderComponent(getRiskSignal(1))
    const riskSignals = screen.getAllByTestId('riskSignalRing')
    expect(riskSignals[0]).toHaveClass('bg-attention-40')
    expect(riskSignals[1]).toHaveClass('bg-white')
    expect(riskSignals[2]).toHaveClass('bg-white')
  })

  it('should render two colored rings and one white for category 2', () => {
    renderComponent(getRiskSignal(2))
    const riskSignals = screen.getAllByTestId('riskSignalRing')
    expect(riskSignals[0]).toHaveClass('bg-error-10')
    expect(riskSignals[1]).toHaveClass('bg-error-10')
    expect(riskSignals[2]).toHaveClass('bg-white')
  })

  it('should render three colored rings for category 3', () => {
    renderComponent(getRiskSignal(3))
    const riskSignals = screen.getAllByTestId('riskSignalRing')
    expect(riskSignals[0]).toHaveClass('bg-error-40')
    expect(riskSignals[1]).toHaveClass('bg-error-40')
    expect(riskSignals[2]).toHaveClass('bg-error-40')
  })

  it('should render tooltip', async () => {
    renderComponent(getRiskSignal(1))
    const riskSignals = screen.getAllByTestId('riskSignalRing')
    await userEvent.hover(riskSignals[0])
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('should render no risk signal symbol if no risk category', async () => {
    renderComponent(getRiskSignal(null))
    expect(screen.getByTestId('noRiskSignalSymbol')).toBeInTheDocument()
  })

  it('should render description on hover if no risk category', async () => {
    renderComponent(getRiskSignal(null))
    const riskSignal = screen.getByTestId('noRiskSignalSymbol')
    await userEvent.hover(riskSignal)
    expect(screen.getByText('description')).toBeInTheDocument()
  })
})
