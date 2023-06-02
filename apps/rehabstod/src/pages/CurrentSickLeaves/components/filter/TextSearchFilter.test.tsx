import { render, screen } from '@testing-library/react'
import { describe, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { TextSearchFilter } from './TextSearchFilter'

const TITLE = 'titel'
const DESCRIPTION = 'description'
const PLACEHOLDER = 'placeholder'

let onChange: (value: string) => void

const renderComponent = () => {
  onChange = vi.fn()
  render(<TextSearchFilter title={TITLE} description={DESCRIPTION} onTextSearchChange={onChange} placeholder={PLACEHOLDER} />)
}

describe('TextSearchFilter', () => {
  it('should render without throwing', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should show title', () => {
    renderComponent()
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })
  it('should call onChange', async () => {
    renderComponent()
    await userEvent.type(await screen.findByLabelText(TITLE), 'Reko')
    expect(onChange).toHaveBeenLastCalledWith('Reko')
  })
})
