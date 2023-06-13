/* eslint-disable react/jsx-props-no-spreading */
import {ComponentProps} from 'react'
import {NumberInput} from './NumberInput'

export function FormattedNumberInput({
  onChange,
  min,
  max,
  value,
  defaultValue,
  ...props
}: Omit<ComponentProps<typeof NumberInput>, 'onChange' | 'value'> & {
  defaultValue: string
  min: string
  max: string
  value?: string
  onChange: (value: string) => void
}) {
  const numbersRegex = /([0-9]|\b)+/
  const convertValue = (val: number | undefined, minLimit: number, maxLimit: number): number =>
    val != null && !Number.isNaN(val) ? Math.max(minLimit, Math.min(val, maxLimit)) : Number(defaultValue)

  function maxConsecutiveZeroes(event: React.KeyboardEvent<HTMLInputElement>) {
    return event.currentTarget.value === '0' && event.key !== 'Backspace'
  }

  function maxLengthReached(event: React.KeyboardEvent<HTMLInputElement>) {
    return event.currentTarget.value.length === 2 && event.key !== 'Backspace'
  }


  return (
    <NumberInput
      type="number"
      onChange={({ currentTarget }) => onChange(currentTarget.value)}
      onBlur={() => onChange(convertValue(value === '' ? NaN : Number(value), Number(min), Number(max)).toString())}
      value={value ? parseInt(value, 10) : value}
      min={min}
      max={max}
      {...props}
      onKeyDown={(event) => {
        if (!numbersRegex.test(event.key) || maxConsecutiveZeroes(event) || maxLengthReached(event)) {
          event.preventDefault()
        }
      }}
      onPaste={(event) => {
        event.preventDefault()
      }}
    />
  )
}
