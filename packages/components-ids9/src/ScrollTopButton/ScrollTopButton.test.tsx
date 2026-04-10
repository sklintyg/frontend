import { render, screen } from '@testing-library/react'
import { ScrollTopButton } from './ScrollTopButton'

it('Should render as expected', () => {
  const { container } = render(<ScrollTopButton />)
  expect(container).toMatchSnapshot()
})

it('Button should have correct label', () => {
  render(<ScrollTopButton />)
  expect(screen.getByRole('button', { name: 'Till toppen av sidan' })).toBeInTheDocument()
})
