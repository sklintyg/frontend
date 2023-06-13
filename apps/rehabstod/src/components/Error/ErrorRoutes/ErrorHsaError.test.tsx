import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorHsaError } from './ErrorHsaError'
import { ErrorTitleEnum } from '../../../schemas/errorSchema'

const renderComponent = () => {
  renderWithRouter(<ErrorHsaError />)
}
describe('ErrorHsaError component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_HSA_ERROR)).toBeInTheDocument()
  })
  it('displays link', async () => {
    renderComponent()
    expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  })
})
