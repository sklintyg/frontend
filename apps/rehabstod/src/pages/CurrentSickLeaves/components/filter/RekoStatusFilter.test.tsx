import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { RekoStatusFilter } from './RekoStatusFilter'

const DESCRIPTION = 'description'
let onChange: (values: string[]) => void

const STATUSES = [
  { id: 'REKO_1', name: 'Ingen' },
  { id: 'REKO_2', name: 'Kontaktad' },
]

const renderComponent = (selected?: string[]) => {
  onChange = vi.fn()

  render(<RekoStatusFilter description={DESCRIPTION} statuses={STATUSES} onChange={onChange} selected={selected ?? []} />)
}

describe('RekoStatusFilter', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('REKO-status')).toBeInTheDocument()
  })

  it('should show options when opening dropdown', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText(STATUSES[0].name)).toBeInTheDocument()
    expect(screen.getByText(STATUSES[1].name)).toBeInTheDocument()
  })

  it('should call on from change when changing from input', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText(STATUSES[0].name))
    expect(onChange).toHaveBeenLastCalledWith([STATUSES[0].id])
  })

  it('should show options as unchecked by default', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked()
    expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked()
  })

  it('should show options sent in selected as checked', async () => {
    renderComponent([STATUSES[0].id, STATUSES[1].id])
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
    expect(screen.getAllByRole('checkbox')[1]).toBeChecked()
  })
})
