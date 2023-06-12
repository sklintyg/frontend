import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { DisplayError } from './DisplayError'

const HEADLINE = 'Tekniskt fel'
const TYPE = 'error'
const TEXT = 'Ett fel har uppstått'

const renderComponent = () => {
  renderWithRouter(<DisplayError heading={HEADLINE} errorType={TYPE} text={TEXT} dynamicLink />)
}
describe('DisplayError', () => {
  it('Should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('Should render text', () => {
    renderComponent()
    expect(screen.getByText(TEXT)).toBeInTheDocument()
  })

  it('Should displays link', async () => {
    renderComponent()
    expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  })
})
