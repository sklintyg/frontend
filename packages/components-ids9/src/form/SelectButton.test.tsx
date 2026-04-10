import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { SelectButton } from './SelectButton'

const renderComponent = (open = false) => {
  const handleOpenChange = vi.fn()

  render(
    <SelectButton title="TITLE" handleOpenChange={handleOpenChange} open={open}>
      <span>CHILDREN</span>
    </SelectButton>
  )
}

describe('SelectButton', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText('TITLE')).toBeInTheDocument()
  })

  it('should show children when open is true', async () => {
    renderComponent(true)
    expect(screen.getByText('CHILDREN')).toBeInTheDocument()
  })

  it('should hide children when open is false', async () => {
    renderComponent(false)
    expect(screen.queryByText('CHILDREN')).not.toBeInTheDocument()
  })
})
