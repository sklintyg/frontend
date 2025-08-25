import styled from 'styled-components'
import type { FMBDiagnosisCodeInfo } from '../../types'
import { FMBDiagnosisCodeInfoFormContentHeading, FMBDiagnosisCodeInfoFormType } from '../../types'
import InfoBox from '../utils/InfoBox'
import FMBPanelDiagnosisHeader from './FMBPanelDiagnosisHeader'
import FMBPanelDiagnosisInfoLink from './FMBPanelDiagnosisInfoLink'
import FMBPanelDiagnosisInfoSection from './FMBPanelDiagnosisInfoSection'
import FMBPanelGuidanceSection from './FMBPanelGuidanceSection'
import FMBPanelRelatedDiagnoses from './FMBPanelRelatedDiagnoses'

const Wrapper = styled.div`
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
}

const FMBPanelDiagnosisInfo = ({ fmbDiagnosisCodeInfo, hasSeveralDiagnoses }: Props) => {
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
    <Wrapper>
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
  )
}

export default FMBPanelDiagnosisInfo
