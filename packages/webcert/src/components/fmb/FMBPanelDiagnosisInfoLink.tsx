import React from 'react'
import { FMBDiagnosisCodeInfo } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

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
      <Link className="iu-fs-200" target="_blank" to={{ pathname: fmbDiagnosisCodeInfo.referenceLink }}>
        <p className="iu-fs-200">
          {fmbDiagnosisCodeInfo.referenceDescription}
          <FontAwesomeIcon icon={faExternalLinkAlt} className="iu-ml-200 iu-fs-100" />
        </p>
      </Link>
    </div>
  )
}

export default FMBPanelDiagnosisInfoLink
