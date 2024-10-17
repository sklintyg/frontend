import { fakerFromSchema } from 'fake'
import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { expect } from 'vitest'
import { server } from '../../mocks/server'
import { configSchema } from '../../schemas'
import { updateShowAboutDialog } from '../../store/slices/settings.slice'
import { store } from '../../store/store'
import { fakeUser } from '../../utils/fake/fakeUser'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { AboutDialog } from './AboutDialog'

beforeEach(() => {
  store.dispatch(updateShowAboutDialog(true))
})

it('Should hide SRS information if the user doesnt have access to the feature', () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ features: { SRS: { global: false } } })))))
  renderWithRouter(<AboutDialog />)
  expect(screen.queryByText('Var kan jag hitta mer information om Stöd för rätt sjukskrivning (SRS)?')).not.toBeInTheDocument()
})

it('Should display the current version', async () => {
  const version = '1.2.3.4'
  server.use(rest.get('/api/config', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(configSchema)({ version })))))
  renderWithRouter(<AboutDialog />)
  expect(await screen.findByText(`Nuvarande version är ${version}`, { exact: false })).toBeInTheDocument()
})

it('Should close dialog if user clicks button', async () => {
  const { user } = renderWithRouter(<AboutDialog />)
  await user.click(screen.getByText('Stäng'))
  expect(
    screen.queryByText('Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter.')
  ).not.toBeInTheDocument()
})
