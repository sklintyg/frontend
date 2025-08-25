import { fakerFromSchema } from '@frontend/fake'
import { screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../../mocks/server'
import { medarbetarUppdragSchema, personSchema } from '../../../schemas/hsa'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { FakeLogin } from './FakeLogin'

beforeEach(() => {
  const fakeMission = fakerFromSchema(medarbetarUppdragSchema, { seed: 1234 })
  const fakePerson = fakerFromSchema(personSchema, { seed: 4321 })
  const missions = Array.from({ length: 3 }, fakeMission)
  const persons = missions.map(({ hsaId }) => fakePerson({ hsaId }))

  server.use(rest.get('/api/testability/persons', (_, res, ctx) => res(ctx.json(persons))))
  server.use(rest.get('/api/testability/commissions', (_, res, ctx) => res(ctx.json(missions))))
})

it('Should selected vardgivare and vardenhet once fully loaded', async () => {
  renderWithRouter(<FakeLogin />)

  expect(screen.getByTestId('spinner')).toBeInTheDocument()
  await waitFor(() => {
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: 'hsaId' })).toHaveValue('ZBQGHL1000042809-8793')
  })

  expect(screen.getByRole('textbox', { name: 'enhetId' })).toHaveValue('CVSMTR1000040485-97631')

  expect(screen.getByRole('option', { selected: true })).toBeInTheDocument()
  expect(screen.getByRole('option', { selected: true })).toHaveValue('ZBQGHL1000042809-8793_CVSMTR1000040485-97631')
})

it('Should have a fallback login option in case of failure', async () => {
  server.use(rest.get('/api/testability/persons', (_, res, ctx) => res(ctx.status(404))))
  server.use(rest.get('/api/testability/commissions', (_, res, ctx) => res(ctx.status(404))))
  renderWithRouter(<FakeLogin />)

  await waitFor(() => {
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  expect(screen.getByRole('option', { selected: true })).toHaveValue('TSTNMT2321000156-VAAA_TSTNMT2321000156-ALMC')
  expect(screen.getByRole('textbox', { name: 'hsaId' })).toHaveValue('TSTNMT2321000156-VAAA')
  expect(screen.getByRole('textbox', { name: 'enhetId' })).toHaveValue('TSTNMT2321000156-ALMC')
})
