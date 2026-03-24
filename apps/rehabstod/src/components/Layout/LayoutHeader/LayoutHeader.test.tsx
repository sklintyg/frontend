import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { server, waitForRequest } from '../../../mocks/server'
import { fakeError } from '../../../utils/fake/fakeError'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { LayoutHeader } from './LayoutHeader'

describe('With user session', () => {
  it('Should have "about rehabstod" button', async () => {
    renderWithRouter(<LayoutHeader />)

    expect(await screen.findByText('Om Rehabstöd')).toBeInTheDocument()
  })

  it('Should be able to logout', async () => {
    const { user } = renderWithRouter(<LayoutHeader />)

    const avatarButton = await screen.findByRole('button', { name: /Liam Fransson.*Gunnarsson HB/ })
    expect(avatarButton).toBeInTheDocument()

    const pendingRequest = waitForRequest('POST', '/api/testability/logout')
    await user.click(avatarButton)
    await user.click(screen.getByTestId('logout'))

    expect(await pendingRequest).toBeTruthy()
  })
})

describe('Without user session', () => {
  beforeEach(() => {
    server.use(rest.get('/api/user', (req, res, ctx) => res(ctx.status(403), ctx.json(fakeError()))))
  })

  it('Should display login button', async () => {
    renderWithRouter(<LayoutHeader />)

    expect((await screen.findAllByText('Logga in')).length).toBeGreaterThan(0)
  })
})
