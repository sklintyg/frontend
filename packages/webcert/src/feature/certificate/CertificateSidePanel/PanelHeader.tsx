import React, { ReactNode } from 'react'
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
  minimizeSidePanel: ReactNode
}

const PanelHeader: React.FC<Props> = ({ description, minimizeSidePanel }) => {
  return (
    <Root className="iu-bg-grey-300">
      <p className="iu-fw-heading">{description}</p>
      {minimizeSidePanel}
    </Root>
  )
}

export default PanelHeader
