import { CertificateMetadata, CertificateStatus, getReplacedCertificateStatus, StatusWithIcon } from '@frontend/common'
import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  certificateMetadata: CertificateMetadata
}

const ReplacedStatus: React.FC<Props> = ({ certificateMetadata }) => {
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
