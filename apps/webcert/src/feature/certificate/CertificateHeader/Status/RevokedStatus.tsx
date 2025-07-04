import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import TextWithInfoModal from '../../../../components/utils/Modal/TextWithInfoModal'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import { getIsLocked } from '../../../../store/certificate/certificateSelectors'
import type { CertificateMetadata } from '../../../../types'
import { CertificateRelationType } from '../../../../types'
import WCDynamicLink from '../../../../utils/WCDynamicLink'

interface Props {
  certificateMetadata: CertificateMetadata
}

const RevokedStatus = ({ certificateMetadata }: Props) => {
  const isLocked = useSelector(getIsLocked)

  const getRevokedStatus = () => {
    const parent = certificateMetadata.relations.parent
    if (!parent) {
      return null
    }
    switch (parent.type) {
      case CertificateRelationType.COMPLEMENTED:
        return (
          <>
            Intyget är en komplettering av ett tidigare intyg som också kan behöva makuleras.{' '}
            <Link className={'iu-color-error'} to={`/certificate/${parent.certificateId}`}>
              Öppna intyget
            </Link>
          </>
        )
      case CertificateRelationType.RENEW:
      case CertificateRelationType.EXTENDED:
        return (
          <>
            Intyget är förnyat utifrån ett tidigare intyg som också kan behöva makuleras.{' '}
            <Link className={'iu-color-error'} to={`/certificate/${parent.certificateId}`}>
              Öppna intyget
            </Link>
          </>
        )
      case CertificateRelationType.REPLACED:
        return (
          <>
            Intyget ersatte ett tidigare intyg som också kan behöva makuleras.{' '}
            <Link className={'iu-color-error'} to={`/certificate/${parent.certificateId}`}>
              Öppna intyget
            </Link>
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
        <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'}>
          Utkastet är makulerat
        </StatusWithIcon>
      ) : (
        <StatusWithIcon icon={'ErrorOutlineIcon'} isModal={true} additionalTextStyles={'iu-color-error'}>
          <TextWithInfoModal text="Intyget är makulerat" modalTitle="Intyget är makulerat" className="iu-color-error">
            <p>
              Intyget är inte längre tillgängligt för patienten i Intyg, som nås via{' '}
              <WCDynamicLink css={'iu-color-error'} linkKey="minaintyg" />.
            </p>
          </TextWithInfoModal>
        </StatusWithIcon>
      )}
      {revokedStatus && (
        <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'}>
          {revokedStatus}
        </StatusWithIcon>
      )}
    </>
  )
}

export default RevokedStatus
