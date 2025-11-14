import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { FormattedNumberInput } from './FormattedNumberInput'

const max = '365'
const min = '1'
const defaultValue = '100'
const label = 'label'
const description = 'description'
let onChange: (value: string) => void

const renderComponent = (value?: string) => {
  onChange = vi.fn()
  render(
    <FormattedNumberInput
      onChange={onChange}
      max={max}
      min={min}
      value={value}
      label={label}
      description={description}
      defaultValue={defaultValue}
    />
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
    renderComponent('10')
    expect(screen.getByLabelText(label)).toHaveValue(10)
  })

  it('should call on change when user types input', async () => {
    renderComponent('1')
    await userEvent.type(screen.getByLabelText(label), '10')
    expect(onChange).toHaveBeenLastCalledWith('10')
  })
  it('should not allow consecutive zeroes', async () => {
    renderComponent('0')
    await userEvent.type(screen.getByLabelText(label), '000')
    expect(screen.getByLabelText(label)).toHaveValue(0)
  })
  it('should not allow zeroes with trailing numbers', async () => {
    renderComponent('0')
    await userEvent.type(screen.getByLabelText(label), '12')
    expect(screen.getByLabelText(label)).toHaveValue(0)
  })

  it('should set value to min limit on blur if input is under limit', async () => {
    renderComponent('-100')
    await userEvent.click(screen.getByLabelText(label))
    fireEvent.blur(screen.getByLabelText(label))
    expect(onChange).toHaveBeenLastCalledWith(min)
  })

  it('should set value to max limit on blur if input is over limit', async () => {
    renderComponent('1000')
    await userEvent.click(screen.getByLabelText(label))
    fireEvent.blur(screen.getByLabelText(label))
    expect(onChange).toHaveBeenLastCalledWith(max)
  })

  it('should not allow multiple numbers if exceeding max length', async () => {
    renderComponent('120')
    await userEvent.type(screen.getByLabelText(label), '1200')
    expect(screen.getByLabelText(label)).toHaveValue(120)
  })

  it('should set value to default on blur if input is empty', async () => {
    renderComponent('')
    await userEvent.click(screen.getByLabelText(label))
    fireEvent.blur(screen.getByLabelText(label))
    expect(onChange).toHaveBeenLastCalledWith(defaultValue)
  })
})
