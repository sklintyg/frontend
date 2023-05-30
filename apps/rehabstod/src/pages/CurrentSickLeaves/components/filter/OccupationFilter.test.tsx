import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { OccupationFilter } from './OccupationFilter'

const DESCRIPTION = 'description'
let onChange: (values: string[]) => void

const OCCUPATIONS = [
  { id: 'NUVARANDE_ARBETE', name: 'Nuvarande arbete' },
  { id: 'STUDIER', name: 'Studier' },
]

const renderComponent = (selected?: string[]) => {
  onChange = vi.fn()

  render(<OccupationFilter description={DESCRIPTION} occupations={OCCUPATIONS} onChange={onChange} selected={selected ?? []} />)
}

describe('OccupationFilter', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('Sysselsättning')).toBeInTheDocument()
  })

  it('should show options when opening dropdown', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText(OCCUPATIONS[0].name)).toBeInTheDocument()
    expect(screen.getByText(OCCUPATIONS[1].name)).toBeInTheDocument()
  })

  it('should call on from change when changing from input', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText(OCCUPATIONS[0].name))
    expect(onChange).toHaveBeenLastCalledWith([OCCUPATIONS[0].id])
  })

  it('should show options as unchecked by default', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked()
    expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked()
  })

  it('should show options sent in selected as checked', async () => {
    renderComponent([OCCUPATIONS[0].id, OCCUPATIONS[1].id])
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
    expect(screen.getAllByRole('checkbox')[1]).toBeChecked()
  })
})
