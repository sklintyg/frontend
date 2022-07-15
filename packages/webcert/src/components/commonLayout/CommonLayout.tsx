import React from 'react'
import styled from 'styled-components/macro'
import { CustomTooltip } from '@frontend/common'

const Root = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  overflow: auto;
  flex-grow: 1;
`

const NoFlexGrow = styled.div`
  flex-grow: 0;
`

interface Props {
  header?: React.ReactNode
  subHeader?: React.ReactNode
}

const CommonLayout: React.FC<Props> = ({ header, subHeader, children }) => {
  return (
    <Root>
      <CustomTooltip placement="top" />
      {header && <NoFlexGrow>{header}</NoFlexGrow>}
      {subHeader && <NoFlexGrow>{subHeader}</NoFlexGrow>}
      <Content>{children}</Content>
    </Root>
  )
}

export default CommonLayout
