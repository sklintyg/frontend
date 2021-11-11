import { CustomTooltip, FMBDiagnosisCodeInfo, FMBDiagnosisCodeInfoForm, FMBDiagnosisCodeInfoFormType } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import styled from 'styled-components/macro'

const SubHeader = styled.div`
  font-size: 14px;
  font-weight: bold;
`

interface Props {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo
}

const FMBPanelGuidanceSection: React.FC<Props> = ({ fmbDiagnosisCodeInfo }) => {
  return (
    <div className="iu-p-500">
      <SubHeader data-tip={'Vägledning för sjukskrivning vid ' + fmbDiagnosisCodeInfo.icd10Description + '.'}>
        Vägledning för sjukskrivning
        <FontAwesomeIcon icon={faInfoCircle} className="iu-ml-200 iu-mb-200" />
        <CustomTooltip />
      </SubHeader>
      <ul>
        {fmbDiagnosisCodeInfo.forms
          ?.filter((form: FMBDiagnosisCodeInfoForm) => form.name === FMBDiagnosisCodeInfoFormType.FMB_WORK_CAPACITY)
          .map((form: FMBDiagnosisCodeInfoForm) =>
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
