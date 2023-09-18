import { rest } from 'msw'
import { screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { Home } from './Home'
import { server, waitForRequest } from '../../mocks/server'
import { store } from '../../store/store'
import { api } from '../../store/api'

it('Should render without error', () => {
  expect(() => renderWithRouter(<Home />)).not.toThrow()
})

it.skip('Should use siths url provided by config request', async () => {
  const expectedUrl = 'expectedUrl'
  const openSpy = vi.spyOn(window, 'open')
  server.use(rest.get('/api/config', (_, res, ctx) => res(ctx.status(200), ctx.json({ sithsIdpUrl: expectedUrl }))))
  store.dispatch(api.endpoints.getConfig.initiate())
  const { user } = renderWithRouter(<Home />)
  await waitForRequest('GET', '/api/config')
  await user.click(screen.getByText('Logga in'))
  await waitFor(() => {
    expect(openSpy).toHaveBeenCalledWith(expectedUrl, '_self')
  })
})
