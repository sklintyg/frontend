import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MultipleSelectFilterOption } from './MultipleSelectFilterOption'

const DESCRIPTION = 'description'
const LABEL = 'Välj i listan'
let onChange: (values: string[]) => void

const OPTIONS = [
  { id: 'ID_1', name: 'NAME_1' },
  { id: 'ID_2', name: 'NAME_2' },
]

const renderComponent = (selected?: string[], placeholder?: string) => {
  onChange = vi.fn()

  render(
    <MultipleSelectFilterOption
      label={LABEL}
      description={DESCRIPTION}
      options={OPTIONS}
      onChange={onChange}
      selected={selected ?? []}
      placeholder={placeholder ?? 'Välj i listan'}
    />
  )
}

describe('MultipleSelectFilterOption', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByLabelText(LABEL)).toBeInTheDocument()
  })

  it('should show options when opening dropdown', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('combobox', { name: 'Välj i listan' }))
    expect(screen.getByText(OPTIONS[0].name)).toBeInTheDocument()
    expect(screen.getByText(OPTIONS[1].name)).toBeInTheDocument()
  })

  it('should call on from change when changing from input', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('combobox', { name: 'Välj i listan' }))
    await userEvent.click(screen.getByText(OPTIONS[0].name))
    expect(onChange).toHaveBeenLastCalledWith([OPTIONS[0].id])
  })

  it('should show options as unchecked by default', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('combobox', { name: 'Välj i listan' }))
    expect(screen.getAllByRole('checkbox', { hidden: true })[0]).not.toBeChecked()
    expect(screen.getAllByRole('checkbox', { hidden: true })[1]).not.toBeChecked()
  })

  it('should show options sent in selected as checked', async () => {
    renderComponent([OPTIONS[0].id, OPTIONS[1].id])
    await userEvent.click(screen.getByRole('combobox', { name: 'Välj i listan' }))
    expect(screen.getAllByRole('checkbox', { hidden: true })[0]).toBeChecked()
    expect(screen.getAllByRole('checkbox', { hidden: true })[1]).toBeChecked()
  })
})
