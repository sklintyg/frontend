import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { UnknownInternalError } from './UnknownInternalError'

const renderComponent = () => {
  renderWithRouter(<UnknownInternalError />)
}
const UNKNOWN_INTERNAL_PROBLEM_TITLE = 'Tekniskt fel'
describe('UnknownInternalError component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(UNKNOWN_INTERNAL_PROBLEM_TITLE)).toBeInTheDocument()
  })
  it('displays link', async () => {
    renderComponent()
    expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  })
})
