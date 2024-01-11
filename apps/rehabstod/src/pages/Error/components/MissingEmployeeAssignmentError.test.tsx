import { screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { MissingEmployeeAssignmentError } from './MissingEmployeeAssignmentError'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorContext } from '../Error'

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
