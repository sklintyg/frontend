import { screen, within } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { CurrentSickLeaves } from './CurrentSickLeaves'

it('Should display error when request for fetching sickleave fails', async () => {
  server.use(rest.post('/api/sickleaves/active', (_, res, ctx) => res(ctx.status(400))))
  const { user } = renderWithRouter(<CurrentSickLeaves />)
  await user.click(screen.getByText('Sök'))
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(
    within(screen.getByRole('alert')).getByText(/sjukfall för enheten kan inte visas på grund av ett tekniskt fel/i)
  ).toBeInTheDocument()
})
