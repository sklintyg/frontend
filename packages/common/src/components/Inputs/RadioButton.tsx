import React, { ChangeEvent } from 'react'
import { FormControlLabel, Radio } from '@material-ui/core'
import useTheme from '@material-ui/core/styles/useTheme'

interface Props {
  label: string
  name?: string
  value?: boolean | string
  checked?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  additionalStyles?: string
  disabled?: boolean
}

const RadioButton: React.FC<Props> = (props) => {
  const theme = useTheme()
  const { label, name, onChange, value, checked, additionalStyles, hasValidationError } = props

  return (
    <FormControlLabel
      disabled={props.disabled}
      label={label}
      control={
        <Radio
          className={additionalStyles}
          style={{ color: `${hasValidationError ? `${theme.palette.error.main}` : ''}` }}
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
