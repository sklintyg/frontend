import React, { ChangeEvent } from 'react'
import { FormControlLabel, Radio } from '@material-ui/core'
import useTheme from '@material-ui/core/styles/useTheme'

interface RadioButtonProps {
  label: string
  name: string
  value: boolean
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  additionalStyles?: string
}

const RadioButton: React.FC<RadioButtonProps> = (props) => {
  const theme = useTheme()
  const { label, name, onChange, value, checked, additionalStyles, hasValidationError } = props

  return (
    <FormControlLabel
      label={label}
      control={
        <Radio
          className={additionalStyles}
          style={{ color: `${hasValidationError ? `${theme.palette.warning.main}` : ''}` }}
          color="default"
          name={name}
          value={value}
          onChange={(e) => onChange(e)}
          checked={checked}
        />
      }
    />
  )
}

export default RadioButton
