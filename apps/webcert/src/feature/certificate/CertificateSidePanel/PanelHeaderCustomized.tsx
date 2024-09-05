import type { ReactNode } from 'react'
import type React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  padding: 20px;
  border-bottom: 1px solid #d9dadc;
`

interface Props {
  content: ReactNode
}

const PanelHeaderCustomized: React.FC<Props> = ({ content }) => {
  return <Root className="iu-bg-white">{content}</Root>
}

export default PanelHeaderCustomized
