import { render, screen } from '@testing-library/react'
import CategoryTitle from './CategoryTitle'

it('displays the correct title', () => {
  render(<CategoryTitle>Test title</CategoryTitle>)
  expect(screen.getByRole('heading', { name: /Test title/i })).toBeInTheDocument()
})
