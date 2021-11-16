import React, { useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const StyledCopyIcon = styled(FontAwesomeIcon)`
  &:hover {
    opacity: 0.8;
  }
`

const Root = styled.div`
  text-align: center;
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
      <strong>Fel-id:</strong> {errorId} <StyledCopyIcon icon={faCopy} onClick={handleCopyClick} />
      {displayCopyMessage && <p>Fel-id kopierat till urklipp.</p>}
    </Root>
  )
}

export default ErrorCopyText
