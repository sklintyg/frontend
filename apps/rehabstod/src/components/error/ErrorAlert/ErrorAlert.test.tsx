import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorAlert } from './ErrorAlert'

const HEADLINE = 'Tekniskt fel'
const TYPE = 'error'
const TEXT = 'Ett fel har uppstått'

const renderComponent = (displayErrorId?: boolean) => {
  renderWithRouter(<ErrorAlert heading={HEADLINE} errorType={TYPE} text={TEXT} dynamicLink includeErrorId={displayErrorId ?? true} />)
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
  it('Should displays errorId', () => {
    renderComponent(true)
    expect(screen.findByText('FEL-ID')).toBeInTheDocument()
  })
  it('Should not displays errorId', () => {
    renderComponent(false)
    expect(screen.findByText('FEL-ID')).not.toBeInTheDocument()
  })
})
