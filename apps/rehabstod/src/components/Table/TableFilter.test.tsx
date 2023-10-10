import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { TableFilter } from './TableFilter'

let onSearch: () => void
let onReset: () => void
const renderComponent = () => {
  onSearch = vi.fn()
  onReset = vi.fn()

  renderWithRouter(
    <TableFilter onSearch={onSearch} onReset={onReset}>
      <p>Children</p>
    </TableFilter>
  )
}

it('should render without problems', () => {
  renderComponent()
  expect(() => renderComponent()).not.toThrow()
})

it('should show hide filters button', () => {
  renderComponent()
  expect(screen.getByText('Dölj sökfilter')).toBeInTheDocument()
})

it('should show buttons when filters are open', () => {
  renderComponent()
  expect(screen.getByText('Återställ')).toBeInTheDocument()
  expect(screen.getByText('Sök')).toBeInTheDocument()
})

it('should show children filters are open', () => {
  renderComponent()
  expect(screen.getByText('Children')).toBeInTheDocument()
})

it('should not show children filters are closed', async () => {
  renderComponent()
  await userEvent.click(screen.getByText('Dölj sökfilter'))
  expect(screen.queryByText('Children')).not.toBeInTheDocument()
})

it('should show show filters button after pressing hide', async () => {
  renderComponent()
  await userEvent.click(screen.getByText('Dölj sökfilter'))
  expect(screen.getByText('Visa sökfilter')).toBeInTheDocument()
})

it('should call on search when pressing search button', async () => {
  renderComponent()
  await userEvent.click(screen.getByText('Sök'))
  expect(onSearch).toHaveBeenCalledTimes(1)
})

it('should call on reset when pressing search button', async () => {
  renderComponent()
  await userEvent.click(screen.getByText('Återställ'))
  expect(onReset).toHaveBeenCalledTimes(1)
})
