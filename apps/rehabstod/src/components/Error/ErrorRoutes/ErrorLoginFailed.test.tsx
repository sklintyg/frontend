import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorLoginFailed } from './ErrorLoginFailed'
import { ErrorTitleEnum } from '../../../schemas/errorSchema'

const renderComponent = () => {
  renderWithRouter(<ErrorLoginFailed />)
}
describe('ErrorLoginFailed component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_FAILED)).toBeInTheDocument()
  })
  it('displays link', async () => {
    renderComponent()
    expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  })
})
