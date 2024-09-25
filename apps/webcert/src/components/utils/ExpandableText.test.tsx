import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpandableText } from './ExpandableText'

it('Should not render when text is undefined', () => {
  const { container } = render(<ExpandableText maxLength={200} />)
  expect(container).toBeEmptyDOMElement()
})

it('Should not be expandable when text is less then maxLength', () => {
  render(<ExpandableText text="a b c" maxLength={5} />)
  expect(screen.getByText('a b c')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Visa mer' })).not.toBeInTheDocument()
})

it('Should be expandable when text is above maxLength', () => {
  render(<ExpandableText text="a b c" maxLength={3} />)
  expect(screen.getByText('a b')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Visa mer' })).toBeInTheDocument()
})

it('Should expand when "Visa mer" is pressed', async () => {
  render(<ExpandableText text="a b c" maxLength={3} />)
  await userEvent.click(screen.getByRole('button', { name: 'Visa mer' }))
  expect(screen.getByText('a b c')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Visa mindre' })).toBeInTheDocument()
})

it('Should shrink when "Visa mindre" is pressed', async () => {
  render(<ExpandableText text="a b c" maxLength={3} />)
  await userEvent.click(screen.getByRole('button', { name: 'Visa mer' }))
  await userEvent.click(screen.getByRole('button', { name: 'Visa mindre' }))
  expect(screen.getByText('a b')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Visa mer' })).toBeInTheDocument()
})
