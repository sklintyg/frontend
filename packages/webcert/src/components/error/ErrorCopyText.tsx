import React, { useState } from 'react'
import styled from 'styled-components'
import list from '@frontend/common/src/images/list.svg'

const StyledIcon = styled.img`
  display: inline;
  width: 15px;
  height: 15px;
  margin-left: 5px;
  vertical-align: middle;

  &:hover {
    opacity: 0.8;
  }
`

const Root = styled.div`
  text-align: center;
`

const SuccessMessage = styled.p`
  font-style: italic;
  font-size: 12px;
`

interface Props {
  errorId: string
}

const ErrorCopyText: React.FC<Props> = ({ errorId }) => {
  const [displayCopyMessage, setDisplayCopyMessage] = useState(false)

  if (!errorId) {
    return (
      <Root className={'iu-pt-400'}>
        <p>Kunde inte hämta något fel-id.</p>
      </Root>
    )
  }

  const handleCopyClick = () => {
    setDisplayCopyMessage(true)
    navigator.clipboard.writeText(errorId)
  }

  return (
    <Root className={'iu-pt-400'}>
      <p>
        <strong>Fel-id:</strong> {errorId} <StyledIcon src={list} alt="Kopiera text" onClick={handleCopyClick} />
      </p>
      {displayCopyMessage && <SuccessMessage>Fel-id kopierat till urklipp.</SuccessMessage>}
    </Root>
  )
}

export default ErrorCopyText
