import type React from 'react';
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { InfoCircle } from '../../images'
import type { FMBDiagnosisCodeInfo } from '../../types'

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
        <InfoCircle
          className="iu-ml-200 iu-mb-200"
          tooltip={'Informationen nedan gäller för angivna diagnoskoder, men kan även vara relevant för fler diagnoskoder.'}
        />
      </p>
      <p>{fmbDiagnosisCodeInfo.relatedDiagnoses}</p>
    </div>
  )
}

export default FMBPanelRelatedDiagnoses
