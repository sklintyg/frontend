import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { configSchema } from '../../schemas'
import { srsFeatureSchema } from '../../schemas/userSchema'
import { updateShowAboutDialog } from '../../store/slices/settings.slice'
import { store } from '../../store/store'
import { fakeUser } from '../../utils/fake/fakeUser'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { AboutDialog } from './AboutDialog'

beforeEach(() => {
  store.dispatch(updateShowAboutDialog(true))
})

it('Should display SRS information if the user has access to the feature', async () => {
  server.use(
    rest.get('/api/user', (_, res, ctx) =>
      res(ctx.status(200), ctx.json(fakeUser({ features: { SRS: fakerFromSchema(srsFeatureSchema)({ global: true }) } })))
    )
  )
  renderWithRouter(<AboutDialog />)
  expect(await screen.findByText('Var kan jag hitta mer information om Stöd för rätt sjukskrivning (SRS)?')).toBeInTheDocument()
})

it('Should hide SRS information if the user doesnt have access to the feature', () => {
  server.use(
    rest.get('/api/user', (_, res, ctx) =>
      res(ctx.status(200), ctx.json(fakeUser({ features: { SRS: fakerFromSchema(srsFeatureSchema)({ global: false }) } })))
    )
  )
  renderWithRouter(<AboutDialog />)
  expect(screen.queryByText('Var kan jag hitta mer information om Stöd för rätt sjukskrivning (SRS)?')).not.toBeInTheDocument()
})

it('Should display the current version', async () => {
  const version = '1.2.3.4'
  server.use(rest.get('/api/config', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(configSchema)({ version })))))
  renderWithRouter(<AboutDialog />)
  expect(await screen.findByText(`Nuvarande version är ${version}`, { exact: false })).toBeInTheDocument()
})
