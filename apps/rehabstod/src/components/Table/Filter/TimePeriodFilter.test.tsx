import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { TimePeriodFilter } from './TimePeriodFilter'

const TITLE = 'title'
const DESCRIPTION = 'description'
const onFromChange = vi.fn()
const onToChange = vi.fn()

const renderComponent = (from: string, to: string) => {
  render(
    <TimePeriodFilter title={TITLE} description={DESCRIPTION} onFromChange={onFromChange} onToChange={onToChange} to={to} from={from} />
  )
}

describe('TimePeriodFilter', () => {
  it('should render without issues', () => {
    expect(() => renderComponent('1', '365')).not.toThrow()
  })

  it('should show title', () => {
    renderComponent('1', '365')
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should show to filter', () => {
    renderComponent('1', '365')
    expect(screen.getByText('Från')).toBeInTheDocument()
  })

  it('should show from filter', () => {
    renderComponent('1', '365')
    expect(screen.getByText('Till')).toBeInTheDocument()
  })

  it('should show input fields', () => {
    renderComponent('1', '365')
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
  })
})
