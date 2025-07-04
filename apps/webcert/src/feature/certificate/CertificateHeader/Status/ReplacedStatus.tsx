import { Link } from 'react-router-dom'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import type { CertificateMetadata } from '../../../../types'
import { CertificateStatus } from '../../../../types'
import { getReplacedCertificateStatus } from '../../../../utils'

interface Props {
  certificateMetadata: CertificateMetadata
}

const ReplacedStatus = ({ certificateMetadata }: Props) => {
  const replacedCertificateStatus = getReplacedCertificateStatus(certificateMetadata)

  const getText = () => {
    switch (replacedCertificateStatus) {
      case CertificateStatus.SIGNED:
        return (
          <>
            Intyget har ersatts av{' '}
            <Link className={'iu-color-error'} to={`/certificate/${certificateMetadata.relations.children[0].certificateId}`}>
              detta intyg
            </Link>
          </>
        )
      case CertificateStatus.UNSIGNED:
        return (
          <>
            Det finns redan ett påbörjat utkast som ska ersätta detta intyg.{' '}
            <Link className={'iu-color-error'} to={`/certificate/${certificateMetadata.relations.children[0].certificateId}`}>
              Öppna utkastet
            </Link>
          </>
        )
    }
  }

  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'}>
      {getText()}
    </StatusWithIcon>
  )
}

export default ReplacedStatus
