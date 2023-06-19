import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorContext } from '../Error'
import { UnknownInternalError } from './UnknownInternalError'

const renderComponent = () => {
  renderWithRouter(
    <ErrorContext.Provider value="abc123">
      <UnknownInternalError />
    </ErrorContext.Provider>
  )
}
describe('UnknownInternalError component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(/tekniskt fel/i)).toBeInTheDocument()
  })
  it('displays link', async () => {
    renderComponent()
    expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  })
})
