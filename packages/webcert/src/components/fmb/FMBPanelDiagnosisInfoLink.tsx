import React from 'react'
import { FMBDiagnosisCodeInfo } from '@frontend/common'
import { Link } from 'react-router-dom'
import ExternalLinkIcon from '@frontend/common/src/components/image/ExternalLinkIcon'

interface Props {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo
}

const FMBPanelDiagnosisInfoLink: React.FC<Props> = ({ fmbDiagnosisCodeInfo }) => {
  if (!fmbDiagnosisCodeInfo.referenceLink) {
    return null
  }

  return (
    <div className={`iu-p-500 iu-bg-grey-200`}>
      <p className="iu-fw-heading">Mer information</p>
      <Link target="_blank" to={{ pathname: fmbDiagnosisCodeInfo.referenceLink }}>
        <p>
          {fmbDiagnosisCodeInfo.referenceDescription}
          <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
        </p>
      </Link>
    </div>
  )
}

export default FMBPanelDiagnosisInfoLink
