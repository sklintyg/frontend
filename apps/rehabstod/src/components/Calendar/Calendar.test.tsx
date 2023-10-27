import { parseDate } from '@internationalized/date'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Calendar } from './Calendar'

it('Should render without crashing', () => {
  expect(() => render(<Calendar />)).not.toThrow()
})

it('Should render expected month', () => {
  render(<Calendar defaultValue={parseDate('2020-02-03')} />)
  expect(screen.getByRole('grid', { name: 'February 2020' })).toBeInTheDocument()
})

it('Should be possible to select a date', async () => {
  const onChange = vi.fn()
  render(<Calendar defaultValue={parseDate('2020-02-03')} onChange={onChange} />)
  expect(screen.getAllByLabelText('February 2020').length).toBeTruthy()
  await userEvent.click(screen.getByRole('button', { name: 'Saturday, February 1, 2020' }))
  expect(onChange).toHaveBeenCalledWith(parseDate('2020-02-01'))
})

it('Should have next and previous buttons', () => {
  render(<Calendar />)
  expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
})

it('Should be possible to navigate to previous month', async () => {
  render(<Calendar defaultValue={parseDate('2020-02-03')} />)
  await userEvent.click(screen.getByRole('button', { name: 'Previous' }))
  expect(screen.getByRole('grid', { name: 'January 2020' })).toBeInTheDocument()
})

it('Should be possible to navigate to next month', async () => {
  render(<Calendar defaultValue={parseDate('2020-02-03')} />)
  await userEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(screen.getByRole('grid', { name: 'March 2020' })).toBeInTheDocument()
})
