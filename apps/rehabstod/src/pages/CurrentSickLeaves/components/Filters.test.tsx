import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { Filters } from './Filters'

let onSearch: () => void
let onReset: () => void
const renderComponent = () => {
  onSearch = vi.fn()
  onReset = vi.fn()

  renderWithRouter(<Filters onSearch={onSearch} onReset={onReset} isDoctor={false} />)
}

describe('CurrentSickLeavesFilters', () => {
  beforeEach(() => {
    renderComponent()
  })

  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show hide filters button', () => {
    expect(screen.getByText('Dölj sökfilter')).toBeInTheDocument()
  })

  it('should show buttons when filters are open', () => {
    expect(screen.getByText('Återställ')).toBeInTheDocument()
    expect(screen.getByText('Sök')).toBeInTheDocument()
  })

  it('should show show filters button after pressing hide', async () => {
    await userEvent.click(screen.getByText('Dölj sökfilter'))
    expect(screen.getByText('Visa sökfilter')).toBeInTheDocument()
  })

  it('should call on search when pressing search button', async () => {
    await userEvent.click(screen.getByText('Sök'))
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('should call on reset when pressing search button', async () => {
    await userEvent.click(screen.getByText('Återställ'))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  describe('TimePeriodFilter', () => {
    it('should set default value for to if user removes value and clicks outside textbox', async () => {
      renderComponent()
      await userEvent.clear(screen.getAllByRole('spinbutton')[1])
      await userEvent.click(screen.getAllByRole('spinbutton')[0])
      expect(screen.getAllByRole('spinbutton')[1]).toHaveValue(10000)
    })

    it('should set default value for from if user removes value and clicks outside textbox', async () => {
      renderComponent()
      await userEvent.clear(screen.getAllByRole('spinbutton')[0])
      await userEvent.click(screen.getAllByRole('spinbutton')[1])
      expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(1)
    })

    it('should call on from change', async () => {
      renderComponent()
      await userEvent.clear(screen.getAllByRole('spinbutton')[0])
      await userEvent.type(screen.getAllByRole('spinbutton')[0], '10')
      expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(10)
    })

    it('should call on to change', async () => {
      renderComponent()
      await userEvent.clear(screen.getAllByRole('spinbutton')[1])
      await userEvent.type(screen.getAllByRole('spinbutton')[1], '5')
      expect(screen.getAllByRole('spinbutton')[1]).toHaveValue(5)
    })
  })
})
