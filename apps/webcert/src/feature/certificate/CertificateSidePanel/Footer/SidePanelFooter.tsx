import type { ReactNode } from 'react'
import styled from 'styled-components'

const Root = styled.div`
  padding: 12px 20px;
  position: sticky;
  bottom: 0;
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
`

interface Props {
  additionalStyles?: string
  children: ReactNode
}

const SidePanelFooter = ({ children, additionalStyles }: Props) => {
  return (
    <Root className={`iu-bg-muted-light iu-color-secondary-dark ${additionalStyles} iu-border-grey-300`}>
      <TextWrapper>{children}</TextWrapper>
    </Root>
  )
}

export default SidePanelFooter
