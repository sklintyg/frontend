import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { FormattedNumberInput } from './FormattedNumberInput'

const max = 365
const min = 1
const defaultValue = '100'
const label = 'label'
const description = 'description'
let onChange: (value: number) => void

const renderComponent = (value = '10') => {
  onChange = vi.fn()
  render(
    <>
      <FormattedNumberInput
        onChange={onChange}
        max={max}
        min={min}
        value={value}
        label={label}
        description={description}
        defaultValue={defaultValue}
      />
      <button type="submit">Button</button>
    </>
  )
}

describe('FormattedNumberInput', () => {
  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render label', () => {
    renderComponent()
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('should set value', () => {
    renderComponent()
    expect(screen.getByLabelText(label)).toHaveValue(10)
  })

  it('should call on change when user types input', async () => {
    renderComponent()
    await userEvent.type(screen.getByLabelText(label), '100')
    expect(onChange).toHaveBeenLastCalledWith('100')
  })

  it('should set value to min limit on blur if input is under limit', async () => {
    renderComponent('-100')
    await userEvent.click(screen.getByLabelText(label))
    await userEvent.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenLastCalledWith(min)
  })

  it('should set value to max limit on blur if input is over limit', async () => {
    renderComponent('1000')
    await userEvent.click(screen.getByLabelText(label))
    await userEvent.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenLastCalledWith(max)
  })

  it('should set value to default on blur if input is empty', async () => {
    renderComponent('')
    await userEvent.click(screen.getByLabelText(label))
    await userEvent.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenLastCalledWith(defaultValue)
  })
})
