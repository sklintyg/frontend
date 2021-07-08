import React, { ReactNode } from 'react'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import styled from 'styled-components'

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  overflow-y: 100%;
`

interface Props {
  tabIndex: number
  selectedTabIndex: number
  minimizeSidePanel: ReactNode
}

const QuestionPanel: React.FC<Props> = ({ minimizeSidePanel }) => {
  return (
    <>
      <PanelHeader description="Kompletteringsbegäran och administrativa frågor" minimizeSidePanel={minimizeSidePanel} />
    </>
  )
}

export default QuestionPanel
