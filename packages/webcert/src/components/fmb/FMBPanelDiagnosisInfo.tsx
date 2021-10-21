import React from 'react'
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
}

const FMBPanelDiagnosisInfo: React.FC<Props> = ({ fmbDiagnosisCodeInfo }) => {
  if (!fmbDiagnosisCodeInfo.diagnosTitle) {
    return (
      <EmptyWrapper className="iu-m-none">
        <InfoBox type={'info'}>
          <p>För den angivna diagnosen finns för tillfället inget FMB-stöd.</p>
        </InfoBox>
      </EmptyWrapper>
    )
  }

  return (
    <>
      <Root className={'iu-m-none'}>
        <FMBPanelGuidanceSection fmbDiagnosisCodeInfo={fmbDiagnosisCodeInfo} />
        <FMBPanelDiagnosisHeader title={fmbDiagnosisCodeInfo.icd10Description} />
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
      </Root>
    </>
  )
}

export default FMBPanelDiagnosisInfo
