import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorAlert } from './ErrorAlert'

const HEADLINE = 'Tekniskt fel'
const TYPE = 'error'
const TEXT = 'Ett fel har uppstått'

const renderComponent = () => {
  const error = { ...new Error('Something went wrong'), id: 'some-id-string' }
  renderWithRouter(<ErrorAlert heading={HEADLINE} errorType={TYPE} text={TEXT} error={error} dynamicLink />)
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

  it('Should render error identifier', () => {
    renderComponent()
    expect(screen.getByText('some-id-string')).toBeInTheDocument()
  })
})
