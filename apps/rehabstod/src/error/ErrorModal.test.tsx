import { screen } from '@testing-library/react'
import { renderWithRouter } from '../utils/renderWithRouter'
import { ErrorModal } from './ErrorModal'

const TEXT = 'Ett fel har uppstått'

const renderComponent = () => {
  renderWithRouter(<ErrorModal description={TEXT} errorCode="ErrorCode" generateError show />)
}
describe('ErrorModal', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render text', () => {
    renderComponent()
    expect(screen.getByText(TEXT)).toBeInTheDocument()
  })

  it('should display error id', () => {
    renderComponent()
    expect(screen.getByText(screen.getByText('FEL-ID:'))).toBeInTheDocument()
  })

  it('should display cancel button', () => {
    renderComponent()
    expect(screen.getByText(screen.getByText('Stäng'))).toBeInTheDocument()
  })
})
