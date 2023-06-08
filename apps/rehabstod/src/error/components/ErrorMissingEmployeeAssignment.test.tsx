import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { ErrorText, ErrorTitle } from '../ErrorCode'
import { ErrorMissingEmployeeAssignment } from './ErrorMissingEmployeeAssignment'

const renderComponent = () => {
  renderWithRouter(<ErrorMissingEmployeeAssignment />)
}
describe('ErrorMissingEmployeeAssignment component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(ErrorTitle.LOGIN_MEDARBETARUPPDRAG_SAKNAS)).toBeInTheDocument()
  })
  it('should render text', () => {
    renderComponent()
    expect(screen.getByText(ErrorText.LOGIN_MEDARBETARUPPDRAG_SAKNAS)).toBeInTheDocument()
  })
})
