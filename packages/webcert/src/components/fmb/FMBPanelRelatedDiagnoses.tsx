import { FMBDiagnosisCodeInfo } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

interface Props {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo
}

const FMBPanelRelatedDiagnoses: React.FC<Props> = ({ fmbDiagnosisCodeInfo }) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <div className="iu-p-500">
      <p className={'iu-fw-heading'}>
        Relaterade diagnoskoder (ICD-10-SE)
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="iu-ml-200 iu-mb-200"
          data-tip={'Informationen nedan gäller för angivna diagnoskoder, men kan även vara relevant för fler diagnoskoder.'}
        />
      </p>
      <p>{fmbDiagnosisCodeInfo.relatedDiagnoses}</p>
    </div>
  )
}

export default FMBPanelRelatedDiagnoses
