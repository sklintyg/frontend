import React from 'react'
import styled from 'styled-components'

interface Props {
  display: boolean
}

const Wrapper = styled.p`
  position: absolute;
`

const InvalidPersonIdMessage: React.FC<Props> = ({ display }) => {
  if (!display) return null
  return <Wrapper className={'iu-color-error'}>Ange ett giltigt person- eller samordningsnummer.</Wrapper>
}
export default InvalidPersonIdMessage
