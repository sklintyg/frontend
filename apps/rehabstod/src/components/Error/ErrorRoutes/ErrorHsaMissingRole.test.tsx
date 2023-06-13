import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorHsaMissingRole } from './ErrorHsaMissingRole'
import { ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'

const renderComponent = () => {
  renderWithRouter(<ErrorHsaMissingRole />)
}
describe('ErrorHsaMissingRole component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL)).toBeInTheDocument()
  })
  it('should render text', () => {
    renderComponent()
    expect(screen.getByText(ErrorTextEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL)).toBeInTheDocument()
  })
})
