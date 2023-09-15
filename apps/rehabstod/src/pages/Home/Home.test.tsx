import { rest } from 'msw'
import { screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { Home } from './Home'
import { server, waitForRequest } from '../../mocks/server'

it('Should render without error', () => {
  expect(() => renderWithRouter(<Home />)).not.toThrow()
})

it('Should use siths url provided by config request', async () => {
  const expectedUrl = 'expectedUrl'
  const openSpy = vi.spyOn(window, 'open')
  server.use(rest.get('/api/config', (_, res, ctx) => res(ctx.status(200), ctx.json({ sithsIdpUrl: expectedUrl }))))
  await waitForRequest('GET', '/api/config')
  const { user } = renderWithRouter(<Home />)
  await user.click(screen.getByText('Logga in'))
  await waitFor(() => {
    expect(openSpy).toHaveBeenCalledWith(expectedUrl, '_self')
  })
})
