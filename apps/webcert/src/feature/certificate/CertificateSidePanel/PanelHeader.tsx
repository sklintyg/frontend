import type React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  padding: 20px;
`

interface Props {
  description: string
}

const PanelHeader = ({ description }: Props) => {
  return (
    <Root>
      <p className="iu-fw-heading">{description}</p>
    </Root>
  )
}

export default PanelHeader
