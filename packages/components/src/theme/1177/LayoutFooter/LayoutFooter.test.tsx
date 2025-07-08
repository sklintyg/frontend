import { render, screen } from '@testing-library/react'
import { LayoutFooter } from './LayoutFooter'

it('Should render correctly', () => {
  const { container } = render(<LayoutFooter hasSession={false} />)
  expect(container).toMatchSnapshot()
  const links = screen.getAllByRole('link', { name: 'Webbkarta' })
  expect(links).toHaveLength(2)
  links.forEach((link) => {
    expect(link).toHaveClass('hidden')
  })
})

it('Should have Webbkarta link when session is available', () => {
  render(<LayoutFooter hasSession />)
  const links = screen.getAllByRole('link', { name: 'Webbkarta' })
  expect(links).toHaveLength(2)
  links.forEach((link) => {
    expect(link).not.toHaveClass('hidden')
  })
})
