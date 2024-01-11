import { render, screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { EmptyInformation } from './EmptyInformation'

const renderComponent = () => {
  render(<EmptyInformation />)
}

describe('EmptyInformation', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show text', () => {
    renderComponent()
    expect(screen.getByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).toBeInTheDocument()
  })
})
