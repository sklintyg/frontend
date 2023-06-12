import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../../utils/renderWithRouter'
import { SelectFilter } from './SelectFilter'

let onChange: (id: string) => void
const LABEL = 'LABEL'
const DESCRIPTION = 'DESCRIPTION'
const OPTIONS = [{ id: 'id', name: 'name' }]

const renderComponent = () => {
  onChange = vi.fn()

  renderWithRouter(<SelectFilter onChange={onChange} label={LABEL} description={DESCRIPTION} options={OPTIONS} />)
}

describe('SelectFilter', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render label', () => {
    renderComponent()
    expect(screen.getByLabelText(LABEL)).toBeInTheDocument()
  })

  it('should render default label', () => {
    renderComponent()
    expect(screen.getByText('Visa alla')).toBeInTheDocument()
  })

  it('should render options', () => {
    renderComponent()
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length + 1)
  })

  it('should call on change if choosing option', async () => {
    renderComponent()
    await userEvent.selectOptions(screen.getByLabelText(LABEL), OPTIONS[0].id)
    expect(onChange).toHaveBeenCalledWith(OPTIONS[0].id)
  })
})
