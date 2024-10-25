import { fakerFromSchema } from '@frontend/fake'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '../../../mocks/server'
import { testDataOptionsDTOSchema } from '../../../schemas/testabilitySchema'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { PatientData } from './PatientData'

beforeEach(() => {
  const testData = fakerFromSchema(testDataOptionsDTOSchema, { seed: 1234 })
  server.use(rest.get('/api/testability/testDataOptions', (_, res, ctx) => res(ctx.json(testData()))))
  server.use(
    rest.post('/api/testability/createSickLeave', (_, res, ctx) => res(ctx.json({ content: 'dd5845ef-28af-477c-8b89-bc64fe876920' })))
  )
})

it('Should show spinner while loading', () => {
  renderWithRouter(<PatientData />)
  expect(screen.getByTestId('spinner')).toBeInTheDocument()
})

it('Should hide spinner when loaded', async () => {
  renderWithRouter(<PatientData />)
  await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())
})

it('Should display error message if unable to load testingdata', async () => {
  server.use(rest.get('/api/testability/testDataOptions', (_, res, ctx) => res(ctx.status(500))))
  renderWithRouter(<PatientData />)
  await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())
  expect(screen.getByText('Alternativ för testdata kunde inte laddas')).toBeInTheDocument()
})

it('Should display certificate name when executed', async () => {
  renderWithRouter(<PatientData />)
  await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument())

  await userEvent.click(screen.getByRole('button', { name: 'Skapa' }))

  expect(screen.getByRole('button', { name: 'Skapa' })).toBeDisabled()
  await waitFor(() => expect(screen.getByRole('button', { name: 'Skapa' })).toBeEnabled())

  expect(screen.getByText('intygs-Id: dd5845ef-28af-477c-8b89-bc64fe876920')).toBeInTheDocument()
})
