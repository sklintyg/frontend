import type React from 'react'
import styled from 'styled-components'

interface Props {
  limit?: number
  value: string
}

const Wrapper = styled.p`
  text-align: right;
  font-style: italic;
`

const CharacterCounter: React.FC<Props> = (props) => {
  const { limit, value } = props

  if (!limit || limit <= 35 || limit > 1000) {
    return null
  }

  return (
    <Wrapper>
      {value ? value.length : 0} av {limit} tecken
    </Wrapper>
  )
}

export default CharacterCounter
