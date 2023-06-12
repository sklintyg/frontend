import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorText, ErrorTitle } from '../ErrorCode'
import { ErrorHsaMissingRole } from './ErrorHsaMissingRole'

const renderComponent = () => {
  renderWithRouter(<ErrorHsaMissingRole />)
}
describe('ErrorHsaMissingRole component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(ErrorTitle.LOGIN_SAKNAR_HSA_REHABROLL)).toBeInTheDocument()
  })
  it('should render text', () => {
    renderComponent()
    expect(screen.getByText(ErrorText.LOGIN_SAKNAR_HSA_REHABROLL)).toBeInTheDocument()
  })
})
