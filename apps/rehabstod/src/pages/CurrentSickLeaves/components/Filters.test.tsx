import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { Filters } from './Filters'

it('should render without problems', () => {
  expect(() => renderWithRouter(<Filters onSearch={vi.fn()} onReset={vi.fn()} isDoctor={false} />)).not.toThrow()
})

it('should show hide filters button', () => {
  renderWithRouter(<Filters onSearch={vi.fn()} onReset={vi.fn()} isDoctor={false} />)
  expect(screen.getByText('Dölj sökfilter')).toBeInTheDocument()
})

it('should show buttons when filters are open', () => {
  renderWithRouter(<Filters onSearch={vi.fn()} onReset={vi.fn()} isDoctor={false} />)
  expect(screen.getByText('Återställ')).toBeInTheDocument()
  expect(screen.getByText('Sök')).toBeInTheDocument()
})

it('should show show filters button after pressing hide', async () => {
  renderWithRouter(<Filters onSearch={vi.fn()} onReset={vi.fn()} isDoctor={false} />)
  await userEvent.click(screen.getByText('Dölj sökfilter'))
  expect(screen.getByText('Visa sökfilter')).toBeInTheDocument()
})

it('should call on search when pressing search button', async () => {
  const onSearch = vi.fn()
  renderWithRouter(<Filters onSearch={onSearch} onReset={vi.fn()} isDoctor={false} />)
  await userEvent.click(screen.getByText('Sök'))
  expect(onSearch).toHaveBeenCalledTimes(1)
})

it('should call on reset when pressing search button', async () => {
  const onReset = vi.fn()
  renderWithRouter(<Filters onSearch={vi.fn()} onReset={onReset} isDoctor={false} />)
  await userEvent.click(screen.getByText('Återställ'))
  expect(onReset).toHaveBeenCalledTimes(1)
})
