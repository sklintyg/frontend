import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectButton } from './SelectButton'

const renderComponent = () => {
  render(
    <SelectButton title="TITLE">
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

  it('should show children when clicking button', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('TITLE'))
    expect(screen.getByText('CHILDREN')).toBeInTheDocument()
  })

  it('should hide children when clicking button twice', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('TITLE'))
    await userEvent.click(screen.getByText('TITLE'))
    expect(screen.queryByText('CHILDREN')).not.toBeInTheDocument()
  })
})
