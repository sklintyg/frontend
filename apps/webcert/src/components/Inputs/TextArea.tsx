import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import CharacterCounter from './CharacterCounter'

const Root = styled.textarea<{
  hideOverflow: boolean
}>`
  cursor: auto;
  overflow-y: ${(props) => (props.hideOverflow ? 'hidden' : '')};
  vertical-align: top;
`

const TextArea = ({
  additionalStyles,
  autoResize,
  disableCounter,
  hasValidationError,
  maxLength,
  name,
  rows = 6,
  value = '',
  ...props
}: {
  additionalStyles?: string
  autoResize?: boolean
  disableCounter?: boolean
  hasValidationError?: boolean
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (autoResize && textareaRef && textareaRef.current) {
      textareaRef.current.style.height = '0px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [autoResize, value])

  return (
    <>
      <Root
        hideOverflow={Boolean(autoResize)}
        className={`${additionalStyles}  ic-textarea iu-no-resize ${hasValidationError ? 'ic-textarea--error' : ''}`}
        rows={rows}
        ref={textareaRef}
        name={name ?? ''}
        id={name}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {!disableCounter && <CharacterCounter limit={maxLength} value={`${value}`} />}
    </>
  )
}

export default TextArea
