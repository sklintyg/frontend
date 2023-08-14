import { render, screen } from '@testing-library/react'
import { Home } from './Home'

it('Should have text', () => {
  render(<Home />)
  expect(screen.getByText('Start')).toBeInTheDocument()
})
