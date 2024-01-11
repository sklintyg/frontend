import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { expect, it, describe, beforeEach } from 'vitest'
import { LayoutHeader } from './LayoutHeader'
import { server, waitForRequest } from '../../../mocks/server'
import { fakeError } from '../../../utils/fake/fakeError'
import { renderWithRouter } from '../../../utils/renderWithRouter'

describe('With user session', () => {
  it('Should have "about rehabstod" button', async () => {
    renderWithRouter(<LayoutHeader />)

    expect(screen.getByText('Rehabstöd')).toBeInTheDocument()
    expect(await screen.findByText('Om Rehabstöd')).toBeInTheDocument()
  })

  it('Should be able to logout', async () => {
    const { user } = renderWithRouter(<LayoutHeader />)

    expect(await screen.findByTestId('logout-button')).toBeInTheDocument()

    const pendingRequest = waitForRequest('POST', '/logout')
    user.click(screen.getByTestId('logout-button'))

    expect(await pendingRequest).toBeTruthy()
  })
})

describe('Without user session', () => {
  beforeEach(() => {
    server.use(rest.get('/api/user', (req, res, ctx) => res(ctx.status(403), ctx.json(fakeError()))))
  })

  it('Should display login button', async () => {
    renderWithRouter(<LayoutHeader />)

    expect(await screen.findByText('Logga in')).toBeInTheDocument()
  })
})
