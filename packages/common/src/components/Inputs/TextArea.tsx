import React from 'react'
import styled from 'styled-components'
import CharacterCounter from './CharacterCounter'

interface TextAreaProps {
  hasValidationError?: boolean
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  name?: string
  value: string
  additionalStyles?: string
  disabled?: boolean
  rowsMin?: number
  limit: number
  placeholder?: string
}

const Root = styled.textarea`
  cursor: auto;
`

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { hasValidationError, additionalStyles, children, disabled, name, onChange, rowsMin, value, limit, placeholder } = props

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <>
      <Root
        disabled={disabled}
        className={`${additionalStyles}  ic-textarea iu-no-resize ${hasValidationError ? 'ic-textarea--error' : ''}`}
        rows={rowsMin ? rowsMin : 1}
        name={name ?? ''}
        value={value}
        onChange={(e) => handleOnChange(e)}
        maxLength={limit}
        placeholder={placeholder}
      />
      <CharacterCounter limit={limit} value={value}></CharacterCounter>
    </>
  )
}

export default TextArea
