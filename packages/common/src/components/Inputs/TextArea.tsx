import React, { useEffect, useRef } from 'react'
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
  limit?: number
  placeholder?: string
  disableCounter?: boolean
  autoResize?: boolean
}

interface RootProps {
  hideOverflow: boolean
}

const Root = styled.textarea<RootProps>`
  cursor: auto;
  overflow-y: ${(props) => (props.hideOverflow ? 'hidden' : '')};
  height: ${(props) => props.rows === 1 && '3rem !important'};
  vertical-align: top;
`

const TextArea: React.FC<TextAreaProps> = (props) => {
  const {
    hasValidationError,
    additionalStyles,
    disabled,
    name,
    onChange,
    rowsMin,
    value,
    limit,
    placeholder,
    disableCounter,
    autoResize,
  } = props

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e)
    }
  }

  useEffect(() => {
    if (autoResize && textareaRef && textareaRef.current) {
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }, [autoResize, value])

  return (
    <>
      <Root
        hideOverflow={autoResize as boolean}
        disabled={disabled}
        className={`${additionalStyles}  ic-textarea iu-no-resize ${hasValidationError ? 'ic-textarea--error' : ''}`}
        rows={rowsMin ? rowsMin : 6}
        ref={textareaRef}
        name={name ?? ''}
        value={value}
        onChange={(e) => handleOnChange(e)}
        maxLength={limit}
        placeholder={placeholder}
        id={name}
      />
      {!disableCounter && <CharacterCounter limit={limit} value={value}></CharacterCounter>}
    </>
  )
}

export default TextArea
