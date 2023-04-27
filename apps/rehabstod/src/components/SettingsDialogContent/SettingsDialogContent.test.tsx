import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { fakeUserPreferences } from '../../utils/fake'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { SettingsDialogContent } from './SettingsDialogContent'

const preferences = fakeUserPreferences()
let onClose: () => void

const renderComponent = () => {
  onClose = vi.fn()
  renderWithRouter(<SettingsDialogContent onClose={onClose} preferences={preferences} />)
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
          'Välj maximalt antal dagar som får ha passerat efter ett sjukfalls slutdatum för att sjukfallet ska visas upp i sjukfallstabellen. Med denna funktion kan du bevaka de sjukfall som är nyligen avslutade. Välj 0-14 dagar.'
        )
      ).toBeInTheDocument()
    })

    it('should render input', () => {
      renderComponent()
      expect(screen.getByText('Max antal dagar sedan avslut')).toBeInTheDocument()
    })

    it('should change value in input if user types', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut'), '5')
      expect(screen.getByLabelText('Max antal dagar sedan avslut')).toHaveValue(5)
    })

    it('should disable save button if input is over limit', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut'), '800')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is under limit', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut'), '-6')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is empty limit', async () => {
      renderComponent()
      await userEvent.clear(screen.getByLabelText('Max antal dagar sedan avslut'))
      expect(screen.getByLabelText('Max antal dagar sedan avslut')).toHaveValue(null)
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
        screen.getByText(
          'Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall. Välj 0-90 dagar.'
        )
      ).toBeInTheDocument()
    })

    it('should render input', () => {
      renderComponent()
      expect(screen.getByText('Dagar mellan intyg')).toBeInTheDocument()
    })

    it('should change value in input if user types', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg'), '5')
      expect(screen.getByLabelText('Dagar mellan intyg')).toHaveValue(5)
    })

    it('should disable save button if input is over limit', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg'), '800')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is under limit', async () => {
      renderComponent()
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg'), '-5')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is empty limit', async () => {
      renderComponent()
      await userEvent.clear(screen.getByLabelText('Dagar mellan intyg'))
      expect(screen.getByLabelText('Dagar mellan intyg')).toHaveValue(null)
      expect(screen.getByText('Spara')).toBeDisabled()
    })
  })
})
