import React from 'react'
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
  backgroundColor: 'iu-bg-grey-300' | 'iu-bg-main' | 'iu-bg-white'
  textColor?: 'iu-color-text' | 'iu-color-white' | 'iu-color-main'
  additionalStyles?: string
}

const SidePanelFooter: React.FC<Props> = ({ children, backgroundColor, textColor, additionalStyles }) => {
  return (
    <Root className={`${backgroundColor} ${textColor} ${additionalStyles} iu-border-grey-300`}>
      <TextWrapper>{children}</TextWrapper>
    </Root>
  )
}

export default SidePanelFooter
