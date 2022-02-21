import React, { useCallback, useState } from 'react'
import { FMBDiagnosisCodeInfo, FMBDiagnosisCodeInfoFormContentHeading, FMBDiagnosisCodeInfoFormType, InfoBox } from '@frontend/common'
import styled from 'styled-components/macro'
import FMBPanelDiagnosisInfoSection from './FMBPanelDiagnosisInfoSection'
import FMBPanelRelatedDiagnoses from './FMBPanelRelatedDiagnoses'
import FMBPanelDiagnosisHeader from './FMBPanelDiagnosisHeader'
import FMBPanelGuidanceSection from './FMBPanelGuidanceSection'
import FMBPanelDiagnosisInfoLink from './FMBPanelDiagnosisInfoLink'

const Root = styled.div`
  height: 100%;
  overflow-y: auto;
`

interface StyledProps {
  shouldLimitHeight: boolean
  headerHeight: number
}

const Wrapper = styled.div<StyledProps>`
  height: ${(props) => (props.shouldLimitHeight ? `calc(100% -  ${props.headerHeight}px);` : '100%;')};
  overflow-y: auto;
`

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  overflow-y: 100%;
`

interface Props {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo
  hasSeveralDiagnoses: boolean
  headerHeight: number
}

const FMBPanelDiagnosisInfo: React.FC<Props> = ({ fmbDiagnosisCodeInfo, hasSeveralDiagnoses, headerHeight }) => {
  const [shouldLimitHeight, setShouldLimitHeight] = useState(false)

  const contentRef = useCallback((node: HTMLDivElement) => {
    setShouldLimitHeight(node ? node.scrollHeight > node.clientHeight : false)
  }, [])

  if (!fmbDiagnosisCodeInfo.diagnosTitle) {
    return (
      <EmptyWrapper className="iu-m-none">
        <InfoBox type={'observe'}>
          <p>
            {hasSeveralDiagnoses
              ? 'För de angivna diagnoserna finns för tillfället inget FMB-stöd.'
              : 'För den angivna diagnosen finns för tillfället inget FMB-stöd.'}
          </p>
        </InfoBox>
      </EmptyWrapper>
    )
  }

  return (
    <>
      <Root className={'iu-m-none'}>
        <Wrapper ref={contentRef} headerHeight={headerHeight} shouldLimitHeight={shouldLimitHeight}>
          <FMBPanelGuidanceSection fmbDiagnosisCodeInfo={fmbDiagnosisCodeInfo} />
          <FMBPanelDiagnosisHeader title={fmbDiagnosisCodeInfo.diagnosTitle} />
          <FMBPanelRelatedDiagnoses fmbDiagnosisCodeInfo={fmbDiagnosisCodeInfo} />
          <FMBPanelDiagnosisInfoSection
            header={'Funktionsnedsättning'}
            form={fmbDiagnosisCodeInfo.forms?.find((form) => form.name === FMBDiagnosisCodeInfoFormType.FMB_DISABILITY)}
          />
          <FMBPanelDiagnosisInfoSection
            header={'Aktivitetsbegränsning'}
            form={fmbDiagnosisCodeInfo.forms?.find((form) => form.name === FMBDiagnosisCodeInfoFormType.FMB_ACTIVITY_LIMITATION)}
          />
          <FMBPanelDiagnosisInfoSection
            header={'Information om rehabilitering'}
            form={fmbDiagnosisCodeInfo.forms?.find((form) => form.name === FMBDiagnosisCodeInfoFormType.FMB_REHABILITATION_INFORMATION)}
          />
          <FMBPanelDiagnosisInfoSection
            header={'Försäkringsmedicinsk information'}
            form={fmbDiagnosisCodeInfo.forms?.find((form) => form.name === FMBDiagnosisCodeInfoFormType.FMB_DIAGNOSIS)}
            contentHeader={FMBDiagnosisCodeInfoFormContentHeading.FMB_GENERAL_INFO}
          />
          <FMBPanelDiagnosisInfoSection
            header={'Symtom, prognos, behandling'}
            form={fmbDiagnosisCodeInfo.forms?.find((form) => form.name === FMBDiagnosisCodeInfoFormType.FMB_DIAGNOSIS)}
            contentHeader={FMBDiagnosisCodeInfoFormContentHeading.FMB_SYMPTOM_PROGNOSIS_TREATMENT}
          />
          <FMBPanelDiagnosisInfoLink fmbDiagnosisCodeInfo={fmbDiagnosisCodeInfo} />
        </Wrapper>
      </Root>
    </>
  )
}

export default FMBPanelDiagnosisInfo
