import { render, screen } from '@testing-library/react'
import { GlobalAlert } from './GlobalAlert'

const renderComponent = () => {
  render(
    <GlobalAlert>
      <p>Children</p>
    </GlobalAlert>
  )
}

describe('GlobalAlert', () => {
  beforeEach(() => {
    renderComponent()
  })

  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render alert', () => {
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should render children', () => {
    expect(screen.getByText('Children')).toBeInTheDocument()
  })
})
