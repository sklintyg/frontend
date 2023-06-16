import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import { ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorContext } from '../Error'
import { MissingHsaRoleError } from './HsaMissingRoleError'

const renderComponent = () => {
  renderWithRouter(
    <ErrorContext.Provider value="abc123">
      <MissingHsaRoleError />
    </ErrorContext.Provider>
  )
}
describe('HsaMissingRoleError component', () => {
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
