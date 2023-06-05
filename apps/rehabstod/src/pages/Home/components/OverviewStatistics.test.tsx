import { rest } from 'msw'
import { screen } from '@testing-library/react'
import { OverviewStatistics } from './OverviewStatistics'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { server } from '../../../mocks/server'
import { fakeError } from '../../../utils/fake/fakeError'

const renderComponent = () => {
  renderWithRouter(<OverviewStatistics />)
}

describe('OverviewStatistics', () => {
  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('displays error', async () => {
    server.use(rest.get('/api/sickleaves/summary', (_, res, ctx) => res(ctx.status(500), ctx.json(fakeError()))))
    renderComponent()
    expect(await screen.findByText(/Översikten för enheten kan inte visas./i)).toBeInTheDocument()
  })
})
