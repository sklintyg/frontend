import { render, screen } from '@testing-library/react'
import React from 'react'
import PatientIdValidator from './PatientIdValidator'

const EXPECTED_TEXT = 'Ange ett giltigt person- eller samordningsnummer.'

const renderComponent = (display: boolean) => {
  render(<PatientIdValidator display={display} />)
}

describe('PatientIdValidator', () => {
  it('should show error message if display is true', () => {
    renderComponent(true)
    expect(screen.getByText(EXPECTED_TEXT)).toBeInTheDocument()
  })

  it('should not show error message if display is false', () => {
    renderComponent(false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })
})
