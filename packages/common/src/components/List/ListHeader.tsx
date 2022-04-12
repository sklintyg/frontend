import * as React from 'react'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
`

interface Props {
  title: string
  description: string
}

const ListHeader: React.FC<Props> = ({ title, description }) => {
  return (
    <Wrapper>
      <div className="ic-container iu-py-300">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Wrapper>
  )
}

export default ListHeader
