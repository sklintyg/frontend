import React, { ChangeEvent } from 'react'
import { FormControlLabel, Radio } from '@material-ui/core'
import useTheme from '@material-ui/core/styles/useTheme'

interface Props {
  label: string
  id?: string
  name?: string
  value?: string | number | readonly string[] | undefined
  checked?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  additionalStyles?: string
  disabled?: boolean
}

const RadioButton: React.FC<Props> = (props) => {
  const theme = useTheme()
  const { label, name, id, onChange, value, checked, additionalStyles, hasValidationError } = props

  return (
    <div>
      <input
        disabled={props.disabled}
        type="radio"
        id={id}
        name={name}
        style={{ color: `${hasValidationError ? `${theme.palette.error.main}` : ''}` }}
        className={'ic-forms__radio ' + additionalStyles}
        value={value}
        onChange={(e) => onChange(e)}
        checked={checked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default RadioButton
