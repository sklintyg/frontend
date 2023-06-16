import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorContext } from '../Error'
import { MissingEmployeeAssignmentError } from './MissingEmployeeAssignmentError'

const renderComponent = () => {
  renderWithRouter(
    <ErrorContext.Provider value="abc123">
      <MissingEmployeeAssignmentError />
    </ErrorContext.Provider>
  )
}
describe('MissingEmployeeAssignmentError component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(/medarbetaruppdrag saknas/i)).toBeInTheDocument()
  })
  it('should render text', () => {
    renderComponent()
    expect(
      screen.getByText(/Det krävs minst ett giltigt medarbetaruppdrag med ändamål 'Vård och behandling' för att använda Rehabstöd./i)
    ).toBeInTheDocument()
  })
})
