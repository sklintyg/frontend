import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorAlert } from './ErrorAlert'

const HEADLINE = 'Tekniskt fel'
const TYPE = 'error'
const TEXT = 'Ett fel har uppstått'

const renderComponent = () => {
  renderWithRouter(<ErrorAlert heading={HEADLINE} errorType={TYPE} text={TEXT} dynamicLink />)
}
describe('DisplayError', () => {
  it('Should render without a problem', () => {
    expect(renderComponent).not.toThrow()
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
