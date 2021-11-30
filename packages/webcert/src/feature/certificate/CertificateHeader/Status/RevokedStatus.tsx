import React from 'react'
import { CertificateMetadata, TextWithInfoModal, isRevoked, StatusWithIcon } from '@frontend/common'
import WCDynamicLink from '../../../../components/utils/WCDynamicLink'
import { CertificateRelationType } from '@frontend/common/src'
import { Link } from 'react-router-dom'
import { getIsLocked } from '../../../../store/certificate/certificateSelectors'
import { useSelector } from 'react-redux'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  const isLocked = useSelector(getIsLocked)

  const getRevokedStatus = () => {
    const parent = certificateMetadata.relations.parent
    if (!parent) {
      return null
    }
    switch (parent!.type) {
      case CertificateRelationType.COMPLEMENTED:
        return (
          <>
            Intyget är en komplettering av ett tidigare intyg som också kan behöva makuleras.
            <Link to={`/certificate/${parent!.certificateId}`}>Öppna intyget</Link>
          </>
        )
      case CertificateRelationType.RENEW:
      case CertificateRelationType.EXTENDED:
        return (
          <>
            Intyget är förnyat utifrån ett tidigare intyg som också kan behöva makuleras.
            <Link to={`/certificate/${parent!.certificateId}`}>Öppna intyget</Link>
          </>
        )
      case CertificateRelationType.REPLACED:
        return (
          <>
            Intyget ersatte ett tidigare intyg som också kan behöva makuleras.{' '}
            <Link to={`/certificate/${parent!.certificateId}`}>Öppna intyget</Link>
          </>
        )
      default:
        return null
    }
  }

  const revokedStatus = getRevokedStatus()

  return (
    <>
      {' '}
      {isLocked ? (
        <StatusWithIcon icon={'ErrorOutlineIcon'}>Utkastet är makulerat</StatusWithIcon>
      ) : (
        <StatusWithIcon icon={'ErrorOutlineIcon'} isModal={true}>
          <TextWithInfoModal text="Intyget är makulerat" modalTitle="Intyget är makulerat">
            <p>
              Intyget är inte längre tillgängligt för patienten i Mina intyg, som nås via <WCDynamicLink linkKey="minaintyg" />
            </p>
          </TextWithInfoModal>
        </StatusWithIcon>
      )}
      {revokedStatus && <StatusWithIcon icon={'ErrorOutlineIcon'}>{revokedStatus}</StatusWithIcon>}
    </>
  )
}

export default RevokedStatus
