import type React from 'react'
import styled from 'styled-components'

interface Props {
  display: boolean
}

const Wrapper = styled.p`
  width: inherit;
  position: absolute;
  padding-top: 3px;
`

const InvalidPersonIdMessage = ({ display }: Props) => {
  if (!display) return null
  return <Wrapper className="iu-color-error iu-lh-narrow">Ange ett giltigt person- eller samordningsnummer.</Wrapper>
}
export default InvalidPersonIdMessage
