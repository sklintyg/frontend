import { faker, fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { medarbetarUppdragSchema, personSchema } from '../../schemas/hsa'
import { testDataOptionsDTOSchema } from '../../schemas/testabilitySchema'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { Welcome } from './Welcome'

beforeEach(() => {
  faker.seed(1234)
  const missions = Array.from({ length: 3 }, () => fakerFromSchema(medarbetarUppdragSchema)())
  const persons = missions.map(({ hsaId }) => fakerFromSchema(personSchema)({ hsaId }))
  const testData = fakerFromSchema(testDataOptionsDTOSchema)

  server.use(rest.get('/services/api/hsa-api/person', (_, res, ctx) => res(ctx.json(persons))))
  server.use(rest.get('/services/api/hsa-api/medarbetaruppdrag', (_, res, ctx) => res(ctx.json(missions))))
  server.use(rest.get('/api/testability/testDataOptions', (_, res, ctx) => res(ctx.json(testData))))
})

it('Should selected vardgivare and vardenhet once fully loaded', async () => {
  renderWithRouter(<Welcome />)

  expect(await screen.findByText('Testinloggningar Rehabstöd')).toBeInTheDocument()

  expect(screen.getByRole('textbox')).toBeInTheDocument()
  expect(JSON.parse(screen.getByRole<HTMLTextAreaElement>('textbox').value)).toEqual({
    enhetId: 'DNKYAM6072047130-5523',
    hsaId: 'EMQVLP8068227251-7942',
  })

  expect(screen.getByRole('option', { selected: true })).toBeInTheDocument()

  expect(screen.getByRole('option', { selected: true })).toHaveValue('deleniti')
})

it('Should be possible to write freely in textbox', async () => {
  const { user } = renderWithRouter(<Welcome />)

  expect(await screen.findByText('Testinloggningar Rehabstöd')).toBeInTheDocument()

  user.clear(screen.getByRole('textbox'))
  expect(screen.getByRole('textbox')).toHaveValue('')

  await user.type(screen.getByRole('textbox'), 'Hello,{enter}World!')
  expect(screen.getByRole('textbox')).toHaveValue('Hello,\nWorld!')
})

it('Should be possible to change fakeLogin', async () => {
  const { user } = renderWithRouter(<Welcome />)

  expect(await screen.findByText('Testinloggningar Rehabstöd')).toBeInTheDocument()

  expect(screen.getByRole('option', { name: 'illo' })).toBeInTheDocument()
  await user.selectOptions(screen.getByRole('combobox'), ['illo'])

  expect(screen.getByRole('option', { selected: true })).toHaveValue('illo')

  expect(JSON.parse(screen.getByRole<HTMLTextAreaElement>('textbox').value)).toEqual({
    enhetId: 'SJMFNF7716227042-4776',
    hsaId: 'ERBYRX6351623000-9777',
  })
})
