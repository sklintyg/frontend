import { NumberInput } from './NumberInput'

export function FormattedNumberInput({
  label,
  onChange,
  description,
  value,
  max,
  min,
  error,
  inline = false,
  defaultValue,
  disabled,
  bright = false,
}: {
  label: string
  onChange: (value: string) => void
  description?: string
  value: string
  inline?: boolean
  max: string
  min: string
  error?: boolean
  defaultValue: string
  disabled?: boolean
  bright?: boolean
}) {
  const numbersRegex = /([0-9]|\b)+/
  const convertValue = (originalValue: string, minLimit: string, maxLimit: string, valueDefault: string) => {
    if (originalValue === '') {
      return valueDefault
    }

    if (Number(originalValue) < Number(minLimit)) {
      return minLimit
    }

    if (Number(originalValue) > Number(maxLimit)) {
      return maxLimit
    }

    return originalValue
  }

  return (
    <NumberInput
      disabled={!!disabled}
      label={label}
      onChange={(event) => onChange(event.currentTarget.value)}
      onBlur={() => onChange(convertValue(value, min, max, defaultValue))}
      value={value}
      max={max}
      min={min}
      description={description}
      error={error}
      inline={inline}
      onKeyDown={(event) => {
        if (!numbersRegex.test(event.key)) {
          event.preventDefault()
        }
      }}
      onPaste={(event) => {
        event.preventDefault()
      }}
      bright={bright}
    />
  )
}
