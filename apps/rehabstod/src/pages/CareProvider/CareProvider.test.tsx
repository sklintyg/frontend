import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { fakeUser } from '../../utils/fake'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { CareProvider } from './CareProvider'

it('Should render without error', () => {
  expect(() => renderWithRouter(<CareProvider />)).not.toThrow()
})

it('Should render Välj enhet', async () => {
  renderWithRouter(<CareProvider />)
  expect(await screen.findByText('Välj enhet')).toBeInTheDocument()
})

it('displays an alert when user.roleSwitchPossible is true', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ roleSwitchPossible: true })))))
  renderWithRouter(<CareProvider />)
  expect(await screen.findByText(/du har behörigheten Rehabkoordinator på någon/i)).toBeInTheDocument()
})

it('Should not display an alert when user.roleSwitchPossible is false', () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ roleSwitchPossible: false })))))
  renderWithRouter(<CareProvider />)
  expect(screen.queryByText(/du har behörigheten Rehabkoordinator på någon/i)).not.toBeInTheDocument()
})
