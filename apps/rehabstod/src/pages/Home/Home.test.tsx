import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { fakeUser } from '../../utils/fake'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { Home } from './Home'

it('Should render without error', () => {
  expect(() => renderWithRouter(<Home />)).not.toThrow()
})

it('Should present user once logged in', async () => {
  server.use(rest.get(`/api/user`, (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ namn: 'Karolina Ek PhD' })))))

  renderWithRouter(<Home />)

  await waitForElementToBeRemoved(document.querySelector('ids-spinner'))

  expect(screen.getByText('Hej Karolina Ek PhD')).toBeInTheDocument()
})
