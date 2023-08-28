import { FMBDiagnosisCodeInfo, FMBDiagnosisCodeInfoForm, FMBDiagnosisCodeInfoFormType, InfoCircle } from '@frontend/common'
import React from 'react'
import { Italic } from './FMBPanel'

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
      <ul>
        {workCapacityList &&
          workCapacityList.map(
            (form: FMBDiagnosisCodeInfoForm) =>
              form.content[0].list?.map((item: string, index: number) => (
                <li key={index} className="iu-mt-300">
                  {item}
                </li>
              ))
          )}
      </ul>
    </div>
  )
}

export default FMBPanelGuidanceSection
