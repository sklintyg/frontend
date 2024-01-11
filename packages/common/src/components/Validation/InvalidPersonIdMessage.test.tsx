import { render, screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import InvalidPersonIdMessage from './InvalidPersonIdMessage'

const EXPECTED_TEXT = 'Ange ett giltigt person- eller samordningsnummer.'

const renderComponent = (display: boolean) => {
  render(<InvalidPersonIdMessage display={display} />)
}

describe('InvalidPersonIdMessage', () => {
  it('should render component', () => {
    expect(() => renderComponent(false)).not.toThrow()
  })

  it('should show error message if display is true', () => {
    renderComponent(true)
    expect(screen.getByText(EXPECTED_TEXT)).toBeInTheDocument()
  })

  it('should not show error message if display is false', () => {
    renderComponent(false)
    expect(screen.queryByText(EXPECTED_TEXT)).not.toBeInTheDocument()
  })
})
