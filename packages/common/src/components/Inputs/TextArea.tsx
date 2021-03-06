import React from 'react'

interface TextAreaProps {
  hasValidationError?: boolean
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  name?: string
  value: string
  additionalStyles?: string
  disabled?: boolean
  rowsMin?: number
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { hasValidationError, additionalStyles, children, disabled, name, onChange, rowsMin, value } = props

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <textarea
      disabled={disabled}
      className={`${additionalStyles}  ic-textarea iu-no-resize ${hasValidationError ? 'ic-textarea--error' : ''}`}
      rows={rowsMin ? rowsMin : 1}
      name={name ?? ''}
      value={value}
      onChange={(e) => handleOnChange(e)}
    />
  )
}

export default TextArea
