import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  padding: 12px 20px;
  position: sticky;
  bottom: 0;
  margin-top: 50px;
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
`

interface Props {
  backgroundColor: 'iu-bg-grey-300' | 'iu-bg-main' | 'iu-bg-white'
  textColor: 'iu-color-text' | 'iu-color-white' | 'iu-color-main'
}

const SidePanelFooter: React.FC<Props> = ({ children, backgroundColor, textColor }) => {
  return (
    <Root className={`${backgroundColor} ${textColor} iu-border-grey-300`}>
      <TextWrapper>{children}</TextWrapper>
    </Root>
  )
}

export default SidePanelFooter
