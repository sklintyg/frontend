import { render, screen } from '@testing-library/react'
import { SortingArrow } from './SortingArrow'

it('Should have correct labels when not ordered', () => {
  render(<SortingArrow id="foo" orderBy="bar" ascending />)
  expect(screen.getByRole('button', { name: 'Sortera på kolumn' })).toBeInTheDocument()
})

it('Should have correct labels when ordered ascending', () => {
  render(<SortingArrow id="foo" orderBy="foo" ascending />)
  expect(screen.getByRole('button', { name: 'Byt till att sortera fallande' })).toBeInTheDocument()
  expect(screen.getByLabelText('Kolumnen sorteras stigande')).toBeInTheDocument()
})

it('Should have correct labels when ordered descending', () => {
  render(<SortingArrow id="foo" orderBy="foo" ascending={false} />)
  expect(screen.getByRole('button', { name: 'Byt till att sortera stigande' })).toBeInTheDocument()
  expect(screen.getByLabelText('Kolumnen sorteras fallande')).toBeInTheDocument()
})
