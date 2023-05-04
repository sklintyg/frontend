import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    renderComponent({ to: '10' })
    await userEvent.clear(screen.getAllByRole('spinbutton')[0])
    await userEvent.type(screen.getAllByRole('spinbutton')[0], '10')
    expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(10)
  })

  it('should call on to change', async () => {
    renderComponent({ to: '5' })
    await userEvent.clear(screen.getAllByRole('spinbutton')[1])
    await userEvent.type(screen.getAllByRole('spinbutton')[1], '5')
    expect(screen.getAllByRole('spinbutton')[1]).toHaveValue(5)
  })
})
