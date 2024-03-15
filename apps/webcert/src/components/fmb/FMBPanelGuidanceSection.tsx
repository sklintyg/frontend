import React from 'react'
import { InfoCircle } from '../../images'
import { FMBDiagnosisCodeInfo, FMBDiagnosisCodeInfoForm, FMBDiagnosisCodeInfoFormType } from '../../types'
import { Italic } from './FMBPanel'
import FMBPanelGuidanceInfo from './FMBPanelGuidanceInfo'

interface Props {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo
}

const FMBPanelGuidanceSection: React.FC<Props> = ({ fmbDiagnosisCodeInfo }) => {
  const workCapacityList = fmbDiagnosisCodeInfo.forms?.filter(
    (form: FMBDiagnosisCodeInfoForm) => form.name === FMBDiagnosisCodeInfoFormType.FMB_WORK_CAPACITY
  )

  return (
    <div className="iu-p-500">
      <p className={'iu-fw-heading'}>
        Vägledning för sjukskrivning
        <InfoCircle
          className="iu-ml-200 iu-mb-200"
          tooltip={'Vägledning för sjukskrivning vid ' + fmbDiagnosisCodeInfo.originalIcd10Description + '.'}
        />
      </p>
      {!workCapacityList ||
        (workCapacityList.length === 0 && (
          <Italic>För den angivna diagnosen finns ingen FMB-information för Vägledning för sjukskrivning</Italic>
        ))}
      {workCapacityList &&
        workCapacityList.map((form: FMBDiagnosisCodeInfoForm) => <FMBPanelGuidanceInfo info={form.content[0]} key={form.name} />)}
    </div>
  )
}

export default FMBPanelGuidanceSection
