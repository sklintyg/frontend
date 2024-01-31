import React from 'react'
import { Link } from 'react-router-dom'
import { FMBDiagnosisCodeInfo } from '../../types'
import ExternalLinkIcon from '../image/image/ExternalLinkIcon'

interface Props {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo
}

const FMBPanelDiagnosisInfoLink: React.FC<Props> = ({ fmbDiagnosisCodeInfo }) => {
  if (!fmbDiagnosisCodeInfo.referenceLink) {
    return null
  }

  return (
    <div className={`iu-p-500`}>
      <p className="iu-fw-heading">Mer information</p>
      <Link target="_blank" to={{ pathname: fmbDiagnosisCodeInfo.referenceLink }}>
        {fmbDiagnosisCodeInfo.referenceDescription}
        <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
      </Link>
    </div>
  )
}

export default FMBPanelDiagnosisInfoLink
