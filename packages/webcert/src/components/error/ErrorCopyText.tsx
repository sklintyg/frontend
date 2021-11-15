import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const CopyText = styled.p`
  position: absolute;
  right: 20px;
`

interface Props {
  errorId: string
}

const ErrorCopyText: React.FC<Props> = ({ errorId }) => {
  // WIP
  return <CopyText className={'iu-mt-300'}>{errorId}</CopyText>
}

export default ErrorCopyText
