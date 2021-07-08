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
  minimizeSidePanel: ReactNode
  content: ReactNode
}

const PanelHeaderCustomized: React.FC<Props> = ({ minimizeSidePanel, content }) => {
  return (
    <Root className="iu-bg-grey-300">
      {content}
      {minimizeSidePanel}
    </Root>
  )
}

export default PanelHeaderCustomized
