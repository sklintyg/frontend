import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { LayoutFooter } from './LayoutFooter'

it('Should render correctly', () => {
  const { container } = render(<LayoutFooter hasSession={false} />)
  expect(container).toMatchSnapshot()
  expect(screen.queryByRole('link', { name: 'Webbkarta' })).not.toBeInTheDocument()
})

it('Should have Webbkarta link when session is available', () => {
  render(<LayoutFooter hasSession />)
  expect(screen.getAllByRole('link', { name: 'Webbkarta' })).toHaveLength(2)
})
