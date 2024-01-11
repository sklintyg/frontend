import { screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { ErrorModal } from './ErrorModal'
import { ErrorCode } from '../../../schemas/errorSchema'
import { renderWithRouter } from '../../../utils/renderWithRouter'

const TEXT = 'Ett fel har uppstått'

const renderComponent = () => {
  renderWithRouter(<ErrorModal description={TEXT} errorCode={ErrorCode.CLIENT_ERROR} generateError dynamicLink />)
}
describe('ErrorModal', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render text', () => {
    renderComponent()
    expect(screen.getByText(TEXT, { exact: false })).toBeInTheDocument()
  })

  it('should display error id', () => {
    renderComponent()
    expect(screen.getByText('Fel-id:')).toBeInTheDocument()
  })

  it('should display cancel button', () => {
    renderComponent()
    expect(screen.getByText('Stäng')).toBeInTheDocument()
  })

  it('should display link', () => {
    renderComponent()
    expect(
      screen.getByText('Om problemet kvarstår, kontakta i första hand din lokala IT-support och i andra hand', { exact: false })
    ).toBeInTheDocument()
  })
})
