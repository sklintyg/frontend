import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { RangeFilter } from './RangeFilter'

const TITLE = 'title'
const DESCRIPTION = 'description'
let onFromChange: (value: string) => void
let onToChange: (value: string) => void

const renderComponent = (from: string, to: string) => {
  onFromChange = vi.fn()
  onToChange = vi.fn()

  render(
    <RangeFilter
      title={TITLE}
      description={DESCRIPTION}
      onFromChange={onFromChange}
      onToChange={onToChange}
      to={to}
      from={from}
      max="150"
      min="1"
    />
  )
}

describe('RangeFilter', () => {
  it('should render without issues', () => {
    expect(() => renderComponent('1', '100')).not.toThrow()
  })

  it('should show title', () => {
    renderComponent('1', '100')
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should show to filter', () => {
    renderComponent('1', '100')
    expect(screen.getByText('Från')).toBeInTheDocument()
  })

  it('should show from filter', () => {
    renderComponent('1', '100')
    expect(screen.getByText('Till')).toBeInTheDocument()
  })

  it('should show input fields', () => {
    renderComponent('1', '100')
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
  })

  it('should call on from change when changing from input', async () => {
    renderComponent('1', '100')
    await userEvent.clear(screen.getAllByRole('spinbutton')[0])
    await userEvent.type(screen.getAllByRole('spinbutton')[0], '15')
    expect(onFromChange).toHaveBeenLastCalledWith('15')
  })

  it.skip('should call on to change when changing to input', async () => {
    renderComponent('1', '100')
    await userEvent.clear(screen.getAllByRole('spinbutton')[1])
    await userEvent.type(screen.getAllByRole('spinbutton')[1], '20')
    expect(onToChange).toHaveBeenLastCalledWith('20')
  })
})
