import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { UnknownInternalError } from './UnknownInternalError'

const renderComponent = () => {
  renderWithRouter(<UnknownInternalError />)
}
const UNKNOWN_INTERNAL_PROBLEM_TITLE = 'Ett tekniskt problem inträffade'
const UNKNOWN_INTERNAL_PROBLEM_MESSAGE = 'Försök igen och kontakta supporten om problemet kvarstår.'
describe('UnknownInternalError component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(UNKNOWN_INTERNAL_PROBLEM_TITLE)).toBeInTheDocument()
  })
  it('should render text', () => {
    renderComponent()
    expect(screen.getByText(UNKNOWN_INTERNAL_PROBLEM_MESSAGE)).toBeInTheDocument()
  })
})
