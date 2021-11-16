import { FMBDiagnosisCodeInfo } from '@frontend/common'
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

const FMBPanelRelatedDiagnoses: React.FC<Props> = ({ fmbDiagnosisCodeInfo }) => {
  return (
    <div className="iu-p-500">
      <SubHeader data-tip={'Informationen nedan gäller för angivna diagnoskoder, men kan även vara relevant för fler diagnoskoder.'}>
        Relaterade diagnoskoder (ICD-10-SE)
        <FontAwesomeIcon icon={faInfoCircle} className="iu-ml-200 iu-mb-200" />
      </SubHeader>
      <div>{fmbDiagnosisCodeInfo.relatedDiagnoses}</div>
    </div>
  )
}

export default FMBPanelRelatedDiagnoses
