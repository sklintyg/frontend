import type React from 'react'
import { Link } from 'react-router-dom'
import StatusWithIcon from '../../../../components/utils/StatusWithIcon'
import type { CertificateRelation } from '../../../../types'
import { CertificateStatus } from '../../../../types'

interface Props {
  relation: CertificateRelation | undefined
}

const HasBeenComplementedStatus: React.FC<Props> = ({ relation }) => {
  if (!relation) {
    return null
  }

  const getText = () => {
    const status = relation.status
    switch (status) {
      case CertificateStatus.UNSIGNED:
        return 'Det finns redan en påbörjad komplettering.'
      case CertificateStatus.SIGNED:
        return 'Intyget har kompletterats med ett annat intyg.'
    }
  }

  const getLink = () => {
    const status = relation.status
    switch (status) {
      case CertificateStatus.UNSIGNED:
        return 'Öppna utkastet.'
      case CertificateStatus.SIGNED:
        return 'Öppna intyget.'
      default:
        return ''
    }
  }

  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'}>
      {getText()}{' '}
      <Link className={'iu-color-error'} to={`/certificate/${relation.certificateId}`}>
        {getLink()}
      </Link>
    </StatusWithIcon>
  )
}

export default HasBeenComplementedStatus
