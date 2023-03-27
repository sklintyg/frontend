import { faker } from '@faker-js/faker'
import { fakerFromSchema } from '@frontend/fake'
import { medarbetarUppdragSchema, personSchema } from '@frontend/types'
import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { Welcome } from './Welcome'

beforeEach(() => {
  faker.seed(1234)
  const fakePerson = fakerFromSchema(personSchema)
  const fakeMedarbetarUppdrag = fakerFromSchema(medarbetarUppdragSchema)

  const missions = Array.from({ length: 10 }, fakeMedarbetarUppdrag)
  const persons = missions.map(({ hsaId }) => fakePerson({ hsaId }))

  server.use(rest.get('/services/api/hsa-api/person', (_, res, ctx) => res(ctx.json(persons))))
  server.use(rest.get('/services/api/hsa-api/medarbetaruppdrag', (_, res, ctx) => res(ctx.json(missions))))
})

it('Should selected vardgivare and vardenhet once fully loaded', async () => {
  renderWithRouter(<Welcome />)

  expect(await screen.findByText('Testinloggningar Rehabstöd')).toBeInTheDocument()

  const textfield = screen.getByLabelText<HTMLTextAreaElement>('Result')
  expect(textfield).toBeInTheDocument()
  expect(JSON.parse(textfield.value)).toEqual({
    enhetId: 'TRTZCP1000025186-69016',
    hsaId: 'TRTZCP1000025186-69016',
  })

  screen.debug()
})
