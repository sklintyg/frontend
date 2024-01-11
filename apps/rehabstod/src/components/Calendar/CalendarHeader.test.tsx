import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { CalendarHeader } from './CalendarHeader'

it('Should render without crashing', () => {
  expect(() => render(<CalendarHeader title="Hello" prevButtonProps={{}} nextButtonProps={{}} />)).not.toThrow()
})

it('Should display title', () => {
  render(<CalendarHeader title="Hello" prevButtonProps={{}} nextButtonProps={{}} />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
