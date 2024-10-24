import { faker, fakerFromSchema } from '@frontend/fake'
import { screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../../mocks/server'
import { medarbetarUppdragSchema, personSchema } from '../../../schemas/hsa'
import { testDataOptionsDTOSchema } from '../../../schemas/testabilitySchema'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { FakeLogin } from './FakeLogin'

beforeEach(() => {
  faker.seed(1234)
  const missions = Array.from({ length: 3 }, fakerFromSchema(medarbetarUppdragSchema))
  const persons = missions.map(({ hsaId }) => fakerFromSchema(personSchema)({ hsaId }))
  const testData = fakerFromSchema(testDataOptionsDTOSchema)

  server.use(rest.get('/api/testability/persons', (_, res, ctx) => res(ctx.json(persons))))
  server.use(rest.get('/api/testability/commissions', (_, res, ctx) => res(ctx.json(missions))))
  server.use(rest.get('/api/testability/testDataOptions', (_, res, ctx) => res(ctx.json(testData))))
})

it('Should selected vardgivare and vardenhet once fully loaded', async () => {
  renderWithRouter(<FakeLogin />)

  expect(screen.getByTestId('spinner')).toBeInTheDocument()
  await waitFor(() => {
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: 'hsaId' })).toHaveValue('EMQVLP1000078535-78135')
  })

  expect(screen.getByRole('textbox', { name: 'enhetId' })).toHaveValue('DNKYAM1000056356-51255')

  expect(screen.getByRole('option', { selected: true })).toBeInTheDocument()
  expect(screen.getByRole('option', { selected: true })).toHaveValue('deleniti')
})

it('Should have a fallback login option in case of failure', async () => {
  server.use(rest.get('/api/testability/persons', (_, res, ctx) => res(ctx.status(404))))
  server.use(rest.get('/api/testability/commissions', (_, res, ctx) => res(ctx.status(404))))
  renderWithRouter(<FakeLogin />)

  await waitFor(() => {
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  expect(screen.getByRole('option', { selected: true })).toHaveValue('Ajla Doktor (Läkare)')
  expect(screen.getByRole('textbox', { name: 'hsaId' })).toHaveValue('TSTNMT2321000156-VAAA')
  expect(screen.getByRole('textbox', { name: 'enhetId' })).toHaveValue('TSTNMT2321000156-ALMC')
})
