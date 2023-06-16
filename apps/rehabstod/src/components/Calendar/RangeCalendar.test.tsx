import { parseDate } from '@internationalized/date'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { RangeCalendar } from './RangeCalendar'

it('Should render without crashing', () => {
  expect(() => render(<RangeCalendar />)).not.toThrow()
})

it('Should render expected month', () => {
  render(<RangeCalendar defaultValue={{ start: parseDate('2020-02-03'), end: parseDate('2020-02-04') }} />)
  expect(screen.queryAllByLabelText('February 2020').length).toBeTruthy()
})

it('Should be possible to select a date range', async () => {
  userEvent.setup()
  const onChange = vi.fn()
  render(<RangeCalendar defaultValue={{ start: parseDate('2020-02-03'), end: parseDate('2020-02-04') }} onChange={onChange} />)
  expect(screen.queryAllByLabelText('February 2020').length).toBeTruthy()
  await userEvent.click(screen.getByRole('button', { name: 'Saturday, February 1, 2020' }))
  await userEvent.click(screen.getByRole('button', { name: 'Thursday, February 20, 2020' }))
  expect(onChange).toHaveBeenCalledWith({ start: parseDate('2020-02-01'), end: parseDate('2020-02-20') })
})
