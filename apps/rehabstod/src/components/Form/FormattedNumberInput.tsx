import { Input } from 'components'
import type { ComponentProps } from 'react'

export function FormattedNumberInput({
  onChange,
  min,
  max,
  value,
  defaultValue,
  ...props
}: Omit<ComponentProps<typeof Input>, 'onChange' | 'value'> & {
  defaultValue: string
  min: string
  max: string
  value?: string
  onChange: (value: string) => void
}) {
  const selection = window.getSelection()
  const numbersRegex = /([0-9]|\b)+/
  const convertValue = (val: number | undefined, minLimit: number, maxLimit: number): number =>
    val != null && !Number.isNaN(val) ? Math.max(minLimit, Math.min(val, maxLimit)) : Number(defaultValue)

  function maxConsecutiveZeroes(event: React.KeyboardEvent<HTMLInputElement>) {
    return event.currentTarget.value === '0' && event.key === '0'
  }

  function maxLengthReached(event: React.KeyboardEvent<HTMLInputElement>) {
    return (
      event.currentTarget.value.length === `${max}`.length &&
      event.key !== 'Backspace' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Delete' &&
      event.key !== 'Tab' &&
      selection?.type !== 'Range'
    )
  }

  return (
    <Input
      type="number"
      onChange={({ currentTarget }) => onChange(currentTarget.value)}
      onBlur={() => onChange(convertValue(value === '' ? NaN : Number(value), Number(min), Number(max)).toString())}
      value={value ? parseInt(value, 10) : ''}
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
