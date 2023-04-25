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
}) {
  const convertTimePeriodValue = (originalValue: string, minLimit: string, maxLimit: string, valueDefault: string) => {
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
      label={label}
      onChange={(event) => onChange(event.currentTarget.value)}
      onBlur={() => onChange(convertTimePeriodValue(value, min, max, defaultValue))}
      value={value}
      max={max}
      min={min}
      description={description}
      error={error}
      inline={inline}
    />
  )
}
