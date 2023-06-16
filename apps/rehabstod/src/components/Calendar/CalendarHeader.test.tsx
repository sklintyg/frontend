import { render, screen } from '@testing-library/react'
import { CalendarHeader } from './CalendarHeader'

it('Should render without crashing', () => {
  expect(() => render(<CalendarHeader title="Hello" prevButtonProps={{}} nextButtonProps={{}} />)).not.toThrow()

  expect(screen.queryByText('Hello')).toBeInTheDocument()
})
