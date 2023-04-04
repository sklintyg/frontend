import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { server, waitForRequest } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { LayoutHeader } from './LayoutHeader'

describe('Without user session', () => {
  beforeEach(() => {
    server.use(rest.get('/api/user', (req, res, ctx) => res(ctx.status(403))))
  })

  it('Should display login button', async () => {
    renderWithRouter(<LayoutHeader />)

    expect(await screen.findByText('Logga in')).toBeInTheDocument()
  })
})

describe('With user session', () => {
  it('Should have "about rehabstod" button', async () => {
    renderWithRouter(<LayoutHeader />)

    expect(await screen.findByText('Om Rehabstöd')).toBeInTheDocument()
  })

  it('Should be able to logout', async () => {
    const { user } = renderWithRouter(<LayoutHeader />)

    expect(await screen.findByText('Logga ut')).toBeInTheDocument()

    const pendingRequest = waitForRequest('POST', '/logout')
    user.click(screen.getByText('Logga ut'))

    expect(await pendingRequest).toBeTruthy()
  })
})
