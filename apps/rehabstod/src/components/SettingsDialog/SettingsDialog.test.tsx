import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { SettingsDialog } from './SettingsDialog'

it('should render without errors', () => {
  expect(() => renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)).not.toThrow()
})

it('should render save button', () => {
  renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
  expect(screen.getByText('Spara')).toBeInTheDocument()
})

it('should render cancel button', () => {
  renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
  expect(screen.getByText('Avbryt')).toBeInTheDocument()
})

it('should close when clicking cancel button', async () => {
  renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
  await userEvent.click(screen.getByText('Avbryt'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('should close when clicking save button', async () => {
  renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
  await userEvent.click(screen.getByText('Spara'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('should not have save button disabled as default', () => {
  renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
  expect(screen.getByText('Spara')).not.toBeDisabled()
})

describe('days after finished sick leaves', () => {
  it('should render title', () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    expect(screen.getByText('Visa nyligen avslutade sjukfall')).toBeInTheDocument()
  })

  it('should render text', () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    expect(
      screen.getByText(
        'Välj maximalt antal dagar som får ha passerat efter ett sjukfalls slutdatum för att sjukfallet ska visas upp i sjukfallstabellen. Med denna funktion kan du bevaka de sjukfall som är nyligen avslutade.'
      )
    ).toBeInTheDocument()
  })

  it('should render input', () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    expect(screen.getByText('Max antal dagar sedan avslut (0-14 dagar)')).toBeInTheDocument()
  })

  it('should disable save button if input is over limit', async () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)'), '800')
    expect(screen.getByText('Spara')).toBeDisabled()
  })

  it('should disable save button if input is under limit', async () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)'), '-6')
    expect(screen.getByText('Spara')).toBeDisabled()
  })

  it('should disable save button if input is empty limit', async () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    await userEvent.clear(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)'))
    expect(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)')).toHaveValue(null)
    expect(screen.getByText('Spara')).toBeDisabled()
  })
})

describe('days between sick leaves', () => {
  it('should render title', () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    expect(screen.getByText('Antal dagar mellan intyg')).toBeInTheDocument()
  })

  it('should render text', () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    expect(
      screen.getByText('Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall.')
    ).toBeInTheDocument()
  })

  it('should render input', () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    expect(screen.getByText('Dagar mellan intyg (0-90 dagar)')).toBeInTheDocument()
  })

  it('should disable save button if input is over limit', async () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)'), '800')
    expect(screen.getByText('Spara')).toBeDisabled()
  })

  it('should disable save button if input is under limit', async () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)'), '-5')
    expect(screen.getByText('Spara')).toBeDisabled()
  })

  it('should disable save button if input is empty limit', async () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    await userEvent.clear(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)'))
    expect(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)')).toHaveValue(null)
    expect(screen.getByText('Spara')).toBeDisabled()
  })
})

describe('selected care unit', () => {
  it('should render title', () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    expect(screen.getByText('Förvald enhet')).toBeInTheDocument()
  })
  it('should render text', () => {
    renderWithRouter(<SettingsDialog onVisibilityChanged={vi.fn()} />)
    expect(
      screen.getByText(
        'Du kan välja en enhet som du automatiskt loggas in på när Rehabstöd startas. Välj "Ingen förvald enhet" i listan för att rensa ditt val.'
      )
    ).toBeInTheDocument()
  })
})
