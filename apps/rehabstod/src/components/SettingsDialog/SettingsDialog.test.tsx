import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { SettingsDialog } from './SettingsDialog'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { fakeUserPreferences } from '../../utils/fake'

const preferences = fakeUserPreferences()
let onClose: () => void

const renderComponent = (show: string) => {
  onClose = vi.fn()
  renderWithRouter(
    <SettingsDialog onClose={onClose} show={show} preferences={preferences}>
      <p>child</p>
    </SettingsDialog>
  )
}

describe('SettingsDialog', () => {
  it('should render without errors', () => {
    expect(() => renderComponent('true')).not.toThrow()
  })

  it('should render save button', () => {
    renderComponent('true')
    expect(screen.getByText('Spara')).toBeInTheDocument()
  })

  it('should render cancel button', () => {
    renderComponent('true')
    expect(screen.getByText('Avbryt')).toBeInTheDocument()
  })

  it('should call on close when clicking cancel button', async () => {
    renderComponent('true')
    await userEvent.click(screen.getByText('Avbryt'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should call on close when clicking save button', async () => {
    renderComponent('true')
    await userEvent.click(screen.getByText('Spara'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should not have save button disabled as default', () => {
    renderComponent('true')
    expect(screen.getByText('Spara')).not.toBeDisabled()
  })

  describe('days after finished sick leaves', () => {
    it('should render title', () => {
      renderComponent('true')
      expect(screen.getByText('Visa nyligen avslutade sjukfall')).toBeInTheDocument()
    })

    it('should render text', () => {
      renderComponent('true')
      expect(
        screen.getByText(
          'Välj maximalt antal dagar som får ha passerat efter ett sjukfalls slutdatum för att sjukfallet ska visas upp i sjukfallstabellen. Med denna funktion kan du bevaka de sjukfall som är nyligen avslutade. Välj 0-14 dagar.'
        )
      ).toBeInTheDocument()
    })

    it('should render input', () => {
      renderComponent('true')
      expect(screen.getByText('Max antal dagar sedan avslut')).toBeInTheDocument()
    })

    it('should change value in input if user types', async () => {
      renderComponent('true')
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut'), '5')
      expect(screen.getByLabelText('Max antal dagar sedan avslut')).toHaveValue(5)
    })

    it('should disable save button if input is over limit', async () => {
      renderComponent('true')
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut'), '800')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is under limit', async () => {
      renderComponent('true')
      await userEvent.type(screen.getByLabelText('Max antal dagar sedan avslut'), '-6')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is empty limit', async () => {
      renderComponent('true')
      await userEvent.clear(screen.getByLabelText('Max antal dagar sedan avslut'))
      expect(screen.getByLabelText('Max antal dagar sedan avslut')).toHaveValue(null)
      expect(screen.getByText('Spara')).toBeDisabled()
    })
  })

  describe('days between sick leaves', () => {
    it('should render title', () => {
      renderComponent('true')
      expect(screen.getByText('Antal dagar mellan intyg')).toBeInTheDocument()
    })

    it('should render text', () => {
      renderComponent('true')
      expect(
        screen.getByText(
          'Välj hur många dagars uppehåll det maximalt får vara mellan två intyg för att de ska räknas till samma sjukfall. Välj 0-90 dagar.'
        )
      ).toBeInTheDocument()
    })

    it('should render input', () => {
      renderComponent('true')
      expect(screen.getByText('Dagar mellan intyg')).toBeInTheDocument()
    })

    it('should change value in input if user types', async () => {
      renderComponent('true')
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg'), '5')
      expect(screen.getByLabelText('Dagar mellan intyg')).toHaveValue(5)
    })

    it('should disable save button if input is over limit', async () => {
      renderComponent('true')
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg'), '800')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is under limit', async () => {
      renderComponent('true')
      await userEvent.type(screen.getByLabelText('Dagar mellan intyg'), '-5')
      expect(screen.getByText('Spara')).toBeDisabled()
    })

    it('should disable save button if input is empty limit', async () => {
      renderComponent('true')
      await userEvent.clear(screen.getByLabelText('Dagar mellan intyg'))
      expect(screen.getByLabelText('Dagar mellan intyg')).toHaveValue(null)
      expect(screen.getByText('Spara')).toBeDisabled()
    })
  })
})
