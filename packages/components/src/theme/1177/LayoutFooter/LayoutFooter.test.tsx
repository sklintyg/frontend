import { render, screen } from '@testing-library/react'
import { LayoutFooter } from './LayoutFooter'

it('Should render correctly', () => {
  const { container } = render(<LayoutFooter hasSession={false} />)
  expect(container).toMatchSnapshot()
  expect(screen.getAllByRole('link', { name: 'Webbkarta' })).toHaveLength(0)
})

it('Should have Webbkarta link when session is available', () => {
  render(<LayoutFooter hasSession />)
  const links = screen.getAllByRole('link', { name: 'Webbkarta' })
  expect(links).toHaveLength(2)
})
