import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import { vi } from 'vitest'
import { TimePeriodFilter } from './TimePeriodFilter'

const TITLE = 'title'

const renderComponent = (props?: Partial<ComponentProps<typeof TimePeriodFilter>>) => {
  const { from = '1', to = '365' } = props ?? {}
  render(<TimePeriodFilter title={TITLE} description="description" onFromChange={vi.fn()} onToChange={vi.fn()} to={to} from={from} />)
}

describe('TimePeriodFilter', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should show to filter', () => {
    renderComponent()
    expect(screen.getByText('Från')).toBeInTheDocument()
  })

  it('should show from filter', () => {
    renderComponent()
    expect(screen.getByText('Till')).toBeInTheDocument()
  })

  it('should show input fields', () => {
    renderComponent()
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
  })
})
