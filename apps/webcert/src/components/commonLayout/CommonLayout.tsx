import { CustomTooltip, DatePickerBoundryContext } from '@frontend/common'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import CertificateDeletedModal from '../../feature/certificate/RemovedCertificate/CertificateDeletedModal'

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
  const contentRef = useRef<HTMLDivElement>(null)
  const [boundryRef, setBoundryRef] = useState<React.RefObject<HTMLElement>>()

  useEffect(() => {
    setBoundryRef(contentRef)
  }, [contentRef])

  return (
    <DatePickerBoundryContext.Provider value={boundryRef}>
      <Root>
        <CustomTooltip placement="top" />
        {header && <NoFlexGrow>{header}</NoFlexGrow>}
        {subHeader && <NoFlexGrow>{subHeader}</NoFlexGrow>}
        <Content ref={contentRef} className={classnames({ 'ic-container': hasSidePanel, 'popper-boundry': true })}>
          <CertificateDeletedModal />
          {hasSidePanel ? children : <div className={`ic-container ${noPadding === false && 'iu-pt-500 iu-pb-500'}`}>{children}</div>}
        </Content>
      </Root>
    </DatePickerBoundryContext.Provider>
  )
}

export default CommonLayout
