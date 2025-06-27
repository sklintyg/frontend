import type { FMBDiagnosisCodeInfo } from '../../types'
import ExternalLinkIcon from '../image/image/ExternalLinkIcon'

interface Props {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo
}

const FMBPanelDiagnosisInfoLink = ({ fmbDiagnosisCodeInfo }: Props) => {
  if (!fmbDiagnosisCodeInfo.referenceLink) {
    return null
  }

  return (
    <div className={`iu-p-500`}>
      <p className="iu-fw-heading">Mer information</p>
      <a href={fmbDiagnosisCodeInfo.referenceLink} target="_blank" rel="noreferrer">
        {fmbDiagnosisCodeInfo.referenceDescription}
        <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
      </a>
    </div>
  )
}

export default FMBPanelDiagnosisInfoLink
