import { screen } from '@testing-library/react'
import { PatientAGCertificatesTable } from './PatientAGCertificatesTable'
import { renderWithRouter } from '../../../../utils/renderWithRouter'

const renderComponent = () => {
  renderWithRouter(<PatientAGCertificatesTable />)
}

describe('PatientAGCertificatesTable', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render title', () => {
    renderComponent()
    expect(screen.getByText('Intyg till arbetsgivaren')).toBeInTheDocument()
  })

  it('should render accordion title', () => {
    renderComponent()
    expect(
      screen.getByText('Intyg till arbetsgivaren för patienten - räknas inte in i patientens uppskattade dag i sjukfallet.')
    ).toBeInTheDocument()
  })
})
