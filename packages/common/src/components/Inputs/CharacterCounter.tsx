import React from 'react'
import styled from 'styled-components'

interface Props {
  limit: number
  value: string
}

const Wrapper = styled.p`
  text-align: right;
`

const CharacterCounter: React.FC<Props> = (props) => {
  const { limit, value } = props

  if (!limit || limit <= 35 || limit > 1000) {
    return null
  }

  return <Wrapper className={'iu-pb-200'}>Tecken kvar: {limit - value.length}</Wrapper>
}

export default CharacterCounter
