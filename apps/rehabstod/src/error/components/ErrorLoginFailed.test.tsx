import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { ErrorText, ErrorTitle } from '../ErrorCode'
import { ErrorLoginFailed } from './ErrorLoginFailed'

const renderComponent = () => {
  renderWithRouter(<ErrorLoginFailed />)
}
describe('ErrorLoginFailed component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(ErrorTitle.LOGIN_FAILED)).toBeInTheDocument()
  })
  it('should render text', () => {
    renderComponent()
    expect(screen.getByText(ErrorText.LOGIN_FAILED)).toBeInTheDocument()
  })
})