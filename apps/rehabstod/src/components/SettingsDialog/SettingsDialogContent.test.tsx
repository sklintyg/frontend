import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { SettingsDialogContent } from './SettingsDialogContent'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { fakeUserPreferences } from '../../utils/fake'

const preferences = fakeUserPreferences()

let onClose: () => void
let onChange: () => void

const renderComponent = () => {
  onClose = vi.fn()
  onChange = vi.fn()
  renderWithRouter(
    <SettingsDialogContent onClose={onClose} onChange={onChange} savedPreferences={preferences} userPreferences={fakeUserPreferences()} />
  )
}

describe('SettingsDialog', () => {
  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render save button', () => {
    renderComponent()
    expect(screen.getByText('Spara')).toBeInTheDocument()
  })

  it('should render cancel button', () => {
    renderComponent()
    expect(screen.getByText('Avbryt')).toBeInTheDocument()
  })

  it('should call on close when clicking cancel button', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Avbryt'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should call on close when clicking save button', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Spara'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should not have save button disabled as default', () => {
    renderComponent()
    expect(screen.getByText('Spara')).not.toBeDisabled()
  })

  describe('days after finished sick leaves', () => {
    it('should render title', () => {
      renderComponent()
      expect(screen.getByText('Visa nyligen avslutade sjukfall')).toBeInTheDocument()
    })

    it('should render text', () => {
      renderComponent()
      expect(
        screen.getByText(
          'Välj maximalt antal dagar som får ha passerat efter ett sjukfalls slutdatum för att sjukfallet ska visas upp i sjukfallstabellen. Med denna funktion kan du bevaka de sjukfall som är nyligen avslutade.'
        )
      ).toBeInTheDocument()
    })

    it('should render input', () => {
      renderComponent()
      expect(screen.getByText('Max antal dagar sedan avslut (0-14 dagar)')).toBeInTheDocument()
    })

    it('should call on change change if user types in input', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)'), '5')
      expect(onChange).toHaveBeenLastCalledWith({ ...preferences, maxAntalDagarSedanSjukfallAvslut: '5' })
    })

    it('should disable save button if input is over limit', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)'), '800')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is under limit', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)'), '-6')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is empty limit', async () => {
      renderComponent()
      await userEvent.clear(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)'))
      expect(screen.getByLabelText('Max antal dagar sedan avslut (0-14 dagar)')).toHaveValue(null)
      expect(screen.getByText('Spara')).toBeDisabled()
    })
  })

  describe('days between sick leaves', () => {
    it('should render title', () => {
      renderComponent()
      expect(screen.getByText('Antal dagar mellan intyg')).toBeInTheDocument()
    })

    it('should render text', () => {
      renderComponent()
      expect(
        screen.getByText('Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall.')
      ).toBeInTheDocument()
    })

    it('should render input', () => {
      renderComponent()
      expect(screen.getByText('Dagar mellan intyg (0-90 dagar)')).toBeInTheDocument()
    })

    it('should call on change if user types in input', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)'), '5')
      expect(onChange).toHaveBeenLastCalledWith({ ...preferences, maxAntalDagarMellanIntyg: '5' })
    })

    it('should disable save button if input is over limit', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)'), '800')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is under limit', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)'), '-5')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is empty limit', async () => {
      renderComponent()
      await userEvent.clear(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)'))
      expect(screen.getByLabelText('Dagar mellan intyg (0-90 dagar)')).toHaveValue(null)
      expect(screen.getByText('Spara')).toBeDisabled()
    })
  })
  describe('selected care unit', () => {
    it('should render title', () => {
      renderComponent()
      expect(screen.getByText('Förvald enhet')).toBeInTheDocument()
    })
    it('should render text', () => {
      renderComponent()
      expect(
        screen.getByText(
          'Du kan välja en enhet som du automatiskt loggas in på när Rehabstöd startas. Välj "Ingen förvald enhet" i listan för att rensa ditt val.'
        )
      ).toBeInTheDocument()
    })
  })
})
