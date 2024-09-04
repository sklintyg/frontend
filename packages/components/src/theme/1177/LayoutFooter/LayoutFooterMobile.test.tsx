import { render, screen } from '@testing-library/react'
import { LayoutFooterMobile } from './LayoutFooterMobile'

it('Should render correctly', () => {
  const { container } = render(<LayoutFooterMobile hasSession={false} />)
  expect(container).toMatchSnapshot()
  expect(screen.queryByRole('link', { name: 'Webbkarta' })).not.toBeInTheDocument()
})

it('Should have Webbkarta link when session is available', () => {
  render(<LayoutFooterMobile hasSession />)
  expect(screen.getByRole('link', { name: 'Webbkarta' })).toBeInTheDocument()
})
