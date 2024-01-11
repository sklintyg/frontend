import { screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { HsaError } from './HsaError'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorContext } from '../Error'

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
    expect(screen.getByText('Tekniskt fel')).toBeInTheDocument()
  })
  it('displays link', async () => {
    renderComponent()
    expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  })
})
