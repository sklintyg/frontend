import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import { ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'
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
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS)).toBeInTheDocument()
  })
  it('should render text', () => {
    renderComponent()
    expect(screen.getByText(ErrorTextEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS)).toBeInTheDocument()
  })
})
