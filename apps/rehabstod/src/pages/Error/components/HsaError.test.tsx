import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import { ErrorTitleEnum } from '../../../schemas/errorSchema'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorContext } from '../Error'
import { HsaError } from './HsaError'

const renderComponent = () => {
  renderWithRouter(
    <ErrorContext.Provider value="abc123">
      <HsaError />
    </ErrorContext.Provider>
  )
}
describe('HsaError component', () => {
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
