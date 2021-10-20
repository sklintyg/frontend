import React from 'react'
import styled from 'styled-components'

interface TextAreaProps {
  hasValidationError?: boolean
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  name?: string
  value: string
  additionalStyles?: string
  disabled?: boolean
  rowsMin?: number
}

const Root = styled.textarea`
  cursor: auto;
`

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { hasValidationError, additionalStyles, children, disabled, name, onChange, rowsMin, value } = props

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <Root
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
