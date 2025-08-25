import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '../../../mocks/server'
import { updateSettingsPreferences, updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { store } from '../../../store/store'
import { fakeUser } from '../../../utils/fake/fakeUser'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { SettingsDialog } from './SettingsDialog'

beforeEach(() => {
  store.dispatch(updateShowSettingsDialog(true))
})

describe('with predefined settings', () => {
  beforeEach(() => {
    const preferences = { maxAntalDagarMellanIntyg: '12', maxAntalDagarSedanSjukfallAvslut: '6' }
    server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser({ preferences })))))
    store.dispatch(updateSettingsPreferences(preferences))
  })

  it('should render without errors', () => {
    expect(() => renderWithRouter(<SettingsDialog />)).not.toThrow()
  })

  it('should render save button', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText('Spara')).toBeInTheDocument()
  })

  it('should render cancel button', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText('Avbryt')).toBeInTheDocument()
  })

  it('should close when clicking cancel button', async () => {
    renderWithRouter(<SettingsDialog />)
    await userEvent.click(await screen.findByText('Avbryt'))
    expect(screen.queryByRole('dialog')).toHaveAttribute('show', 'false')
  })

  it('should close when clicking save button', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText('Spara')).toBeEnabled()
    await userEvent.click(await screen.findByText('Spara'))
    expect(screen.queryByRole('dialog')).toHaveAttribute('show', 'false')
  })

  it('should not have save button disabled as default', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText('Spara')).toBeEnabled()
  })
})

describe('days after finished sick leaves', () => {
  it('should render title', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText('Visa nyligen avslutade sjukfall')).toBeInTheDocument()
  })

  it('should render text', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(
      await screen.findByText(
        'Välj maximalt antal dagar som får ha passerat efter ett sjukfalls slutdatum för att sjukfallet ska visas upp i sjukfallstabellen. Med denna funktion kan du bevaka de sjukfall som är nyligen avslutade.'
      )
    ).toBeInTheDocument()
  })

  it('should render input', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText('Max antal dagar sedan avslut (0-14 dagar)')).toBeInTheDocument()
  })

  it('should disable save button if input is over limit', async () => {
    renderWithRouter(<SettingsDialog />)
    await userEvent.type(await screen.findByLabelText('Max antal dagar sedan avslut (0-14 dagar)'), '800')
    expect(screen.getByText('Spara')).toBeDisabled()
  })

  it('should disable save button if input is under limit', async () => {
    renderWithRouter(<SettingsDialog />)
    await userEvent.type(await screen.findByLabelText('Max antal dagar sedan avslut (0-14 dagar)'), '-6')
    expect(screen.getByText('Spara')).toBeDisabled()
  })
})

describe('days between sick leaves', () => {
  it('should render title', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText('Antal dagar mellan intyg')).toBeInTheDocument()
  })

  it('should render text', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(
      await screen.findByText(
        'Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall.'
      )
    ).toBeInTheDocument()
  })

  it('should render input', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByLabelText(/dagar mellan intyg/i)).toBeInTheDocument()
  })

  it('should disable save button if input is over limit', async () => {
    renderWithRouter(<SettingsDialog />)
    await userEvent.type(await screen.findByLabelText(/dagar mellan intyg/i), '800')
    expect(await screen.findByText('Spara')).toBeDisabled()
  })

  it('should disable save button if input is under limit', async () => {
    renderWithRouter(<SettingsDialog />)
    await userEvent.type(await screen.findByLabelText(/dagar mellan intyg/i), '-5')
    expect(screen.getByText('Spara')).toBeDisabled()
  })

  it('should disable save button if input is empty limit', async () => {
    updateSettingsPreferences({ maxAntalDagarMellanIntyg: undefined })
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByLabelText(/dagar mellan intyg/i)).toBeInTheDocument()
    expect(screen.getByText('Spara')).toBeDisabled()
  })
})

describe('selected care unit', () => {
  it('should render title', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText('Förvald enhet')).toBeInTheDocument()
  })
  it('should render text', async () => {
    renderWithRouter(<SettingsDialog />)
    expect(await screen.findByText(/du kan välja en enhet som du automatiskt loggas in på när rehabstöd startas/i)).toBeInTheDocument()
  })
})
