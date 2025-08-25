import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '../../../mocks/server'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { TestData } from './TestData'

beforeEach(() => {
  server.use(rest.post('/api/testability/createDefault', (_, res, ctx) => res(ctx.json({ content: 'result text' }))))
})

it('Should show result when button is clicked', async () => {
  renderWithRouter(<TestData />)
  expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Skapa testdata' }))
  await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())
  expect(screen.getByText('result text')).toBeInTheDocument()
})

it('Should display error if request fails', async () => {
  server.use(rest.post('/api/testability/createDefault', (_, res, ctx) => res(ctx.status(500))))
  renderWithRouter(<TestData />)
  expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Skapa testdata' }))
  await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())
  expect(screen.getByText('Fel uppstod vid skapande av testdata')).toBeInTheDocument()
})
