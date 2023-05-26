import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import { rest } from 'msw'
import { App } from './App'
import { server } from './mocks/server'
import { renderWithRouter } from './utils/renderWithRouter'
import { fakeError } from './utils/fake/fakeError'

test('full app rendering/navigating', async () => {
  server.use(rest.get('/api/user', (req, res, ctx) => res(ctx.status(403), ctx.json(fakeError()))))

  renderWithRouter(<App />)

  await waitForElementToBeRemoved(document.querySelector('ids-spinner'))

  expect(screen.getByText(/välkommen till rehabstöd/i)).toBeInTheDocument()
})
