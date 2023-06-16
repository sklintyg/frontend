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
})
