import type React from 'react'
import styled from 'styled-components'

interface Props {
  id: string
  message: string
}

const ValidationTextParagraph = styled.p`
  padding-top: 4px;
`

const ValidationText: React.FC<Props> = ({ id, message }) => {
  return (
    <ValidationTextParagraph id={id} aria-live="polite" className="iu-color-error">
      {message}
    </ValidationTextParagraph>
  )
}

export default ValidationText
