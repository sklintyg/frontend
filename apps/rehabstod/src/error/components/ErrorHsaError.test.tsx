import { describe } from 'vitest'
import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { ErrorHsaError } from './ErrorHsaError'
import { ErrorText, ErrorTitle } from '../ErrorCode'
import { server } from '../../mocks/server'

const renderComponent = () => {
  renderWithRouter(<ErrorHsaError />)
}
describe('ErrorHsaError component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(ErrorTitle.LOGIN_HSA_ERROR)).toBeInTheDocument()
  })
  it.skip('should render text', async () => {
    renderComponent()
    server.use(rest.get('/api/config/links', (req, res, ctx) => res(ctx.status(200), ctx.json('Inera support'))))
    expect(await screen.findByText(ErrorText.LOGIN_HSA_ERROR)).toBeInTheDocument()
  })
  it('displays link', async () => {
    renderComponent()
    expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  })
})
