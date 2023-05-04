/* eslint-disable react/jsx-props-no-spreading */
import { ComponentProps } from 'react'
import { NumberInput } from './NumberInput'

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
    val != null && Boolean(val) ? Math.max(minLimit, Math.min(val, maxLimit)) : Number(defaultValue)
  return (
    <NumberInput
      type="number"
      onChange={({ currentTarget }) => onChange(currentTarget.value)}
      onBlur={() => onChange(convertValue(Number(value), Number(min), Number(max)).toString())}
      value={value ? Number(value).toString() : value}
      min={min}
      max={max}
      {...props}
      onKeyDown={(event) => {
        if (!numbersRegex.test(event.key)) {
          event.preventDefault()
        }
      }}
      onPaste={(event) => {
        event.preventDefault()
      }}
    />
  )
}
