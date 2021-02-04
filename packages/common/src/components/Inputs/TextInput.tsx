import React, { ChangeEvent } from 'react'
import { TextField } from '@material-ui/core'
import useTheme from '@material-ui/core/styles/useTheme'

interface Props {
  label: string
  name?: string
  value?: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  hasValidationError?: boolean
  additionalStyles?: string
  disabled?: boolean
}

const TextInput: React.FC<Props> = (props) => {
  const theme = useTheme()
  const { label, disabled, name, onChange, value, additionalStyles, hasValidationError } = props

  return (
    <TextField
      disabled={disabled}
      className={additionalStyles}
      style={{ color: `${hasValidationError ? `${theme.palette.error.main}` : ''}` }}
      name={name ?? ''}
      onChange={(e) => onChange(e)}
      label={label}
      variant="outlined"
    />
  )
}

export default TextInput
