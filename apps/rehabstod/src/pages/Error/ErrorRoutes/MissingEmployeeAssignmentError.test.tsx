import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { MissingEmployeeAssignmentError } from './MissingEmployeeAssignmentError'
import { ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'

const renderComponent = () => {
  renderWithRouter(<MissingEmployeeAssignmentError />)
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
