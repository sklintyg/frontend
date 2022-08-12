import React from 'react'
import styled from 'styled-components/macro'
import { CustomTooltip } from '@frontend/common'
import classnames from 'classnames'

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
  noPadding?: boolean
  hasSidePanel?: boolean
}

const CommonLayout: React.FC<Props> = ({ header, subHeader, children, hasSidePanel = false, noPadding = false }) => {
  return (
    <Root>
      <CustomTooltip placement="top" />
      {header && <NoFlexGrow>{header}</NoFlexGrow>}
      {subHeader && <NoFlexGrow>{subHeader}</NoFlexGrow>}
      <Content className={classnames({ 'ic-container': hasSidePanel })}>
        {!hasSidePanel ? <div className={`ic-container ${noPadding === false && 'iu-pt-500'}`}>{children}</div> : children}
      </Content>
    </Root>
  )
}

export default CommonLayout
