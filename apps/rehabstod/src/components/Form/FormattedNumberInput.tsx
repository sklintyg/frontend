/* eslint-disable react/jsx-props-no-spreading */
import { ComponentProps } from 'react'
import { NumberInput } from './NumberInput'

export function FormattedNumberInput({
  onChange,
  min,
  max,
  defaultValue,
  ...props
}: Omit<ComponentProps<typeof NumberInput>, 'onChange'> & {
  defaultValue: string
  min: number
  max: number
  onChange: (value: number) => void
}) {
  const numbersRegex = /([0-9]|\b)+/
  const convertValue = (value: number | undefined, minLimit: number, maxLimit: number): number =>
    value != null ? Math.max(minLimit, Math.min(value, maxLimit)) : parseInt(defaultValue, 10)

  return (
    <NumberInput
      onChange={(event) => onChange(parseInt(event.currentTarget.value, 10))}
      onBlur={() => onChange(convertValue(Number(props.value), min, max))}
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
