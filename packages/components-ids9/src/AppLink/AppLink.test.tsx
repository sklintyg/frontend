import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppLink } from './AppLink'

describe('AppLink', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <AppLink to="/test">Test Link</AppLink>
      </MemoryRouter>
    )
    expect(screen.getByText('Test Link')).toBeInTheDocument()
  })

  it('renders as external link with target="_blank" when external is true', () => {
    render(
      <AppLink to="https://example.com" external>
        External Link
      </AppLink>
    )
    const link = screen.getByRole('link', { name: 'External Link' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('renders as internal Link when external is false', () => {
    render(
      <MemoryRouter>
        <AppLink to="/internal">Internal Link</AppLink>
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: 'Internal Link' })
    expect(link).toHaveAttribute('href', '/internal')
  })

  it('renders arrow icon when arrow prop is true', () => {
    render(
      <MemoryRouter>
        <AppLink to="/test" arrow>
          Link with Arrow
        </AppLink>
      </MemoryRouter>
    )
    expect(screen.getByTestId('arrow')).toHaveClass('ids-icon-arrow-right-small')
  })

  it('renders large arrow icon when largeArrow prop is true', () => {
    render(
      <MemoryRouter>
        <AppLink to="/test" arrow largeArrow>
          Link with Large Arrow
        </AppLink>
      </MemoryRouter>
    )
    expect(screen.getByTestId('arrow')).toHaveClass('ids-icon-arrow-right')
  })

  it('passes underlined prop to IDSLink', () => {
    render(
      <MemoryRouter>
        <AppLink to="/test" underlined>
          Underlined Link
        </AppLink>
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Underlined Link' })).toHaveClass('ids-link ids-link--underlined')
  })
})
