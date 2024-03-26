import { render, screen } from '@testing-library/react'
import { SaveCertificateWarningDialog } from './SaveCertificateWarningDialog'

it('Should render as expected', () => {
  render(
    <SaveCertificateWarningDialog open onOpenChange={vi.fn()}>
      Test
    </SaveCertificateWarningDialog>
  )
  expect(screen.getByRole('dialog', { name: 'Spara intyg som PDF' })).toBeInTheDocument()
  expect(screen.getByText(/viktigt! Ditt intyg har information om dig, som ditt namn och andra personuppgifter/i)).toBeInTheDocument()
  expect(screen.getByText(/när du sparar intyget som en PDF-fil, sparas filen på den enhet du använder/i)).toBeInTheDocument()
})
