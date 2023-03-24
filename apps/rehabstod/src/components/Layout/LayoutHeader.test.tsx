import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { LayoutHeader } from './LayoutHeader'

describe('Without user session', () => {
  it('Should display login button', async () => {
    server.use(rest.get('/api/user', (req, res, ctx) => res(ctx.status(403))))

    renderWithRouter(<LayoutHeader />)

    expect(await screen.findByText('Logga in')).toBeInTheDocument()
  })
})

describe('With user session', () => {
  it('Should have "about rehabstod" button', async () => {
    renderWithRouter(<LayoutHeader />)

    expect(await screen.findByText('Om rehabstöd')).toBeInTheDocument()
  })

  it('Should be able to logout', async () => {
    renderWithRouter(<LayoutHeader />)

    expect(await screen.findByText('Ortiz LLC')).toBeInTheDocument()
  })
})
