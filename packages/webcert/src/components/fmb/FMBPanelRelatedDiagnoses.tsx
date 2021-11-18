import { CustomTooltip, FMBDiagnosisCodeInfo } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

interface Props {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo
}

const FMBPanelRelatedDiagnoses: React.FC<Props> = ({ fmbDiagnosisCodeInfo }) => {
  return (
    <div className="iu-p-500">
      <p
        className={'iu-fw-heading'}
        data-tip={'Informationen nedan gäller för angivna diagnoskoder, men kan även vara relevant för fler diagnoskoder.'}>
        Relaterade diagnoskoder (ICD-10-SE)
        <FontAwesomeIcon icon={faInfoCircle} className="iu-ml-200 iu-mb-200" />
        <CustomTooltip />
      </p>
      <p>{fmbDiagnosisCodeInfo.relatedDiagnoses}</p>
    </div>
  )
}

export default FMBPanelRelatedDiagnoses
