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

  server.use(rest.get('/services/api/hsa-api/person', (_, res, ctx) => res(ctx.json(persons))))
  server.use(rest.get('/services/api/hsa-api/medarbetaruppdrag', (_, res, ctx) => res(ctx.json(missions))))
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
