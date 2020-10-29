import {
  CertificateMetadata,
  isReplaced,
  getReplacedCertificateStatus,
  CertificateStatus,
  StatusWithIcon,
  isLocked,
} from '@frontend/common'
import { Link, makeStyles } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  link: {
    color: 'inherit',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}))

interface Props {
  certificateMetadata: CertificateMetadata
}

const ReplacedStatus: React.FC<Props> = ({ certificateMetadata }) => {
  const classes = useStyles()
  const history = useHistory()

  if (!isReplaced(certificateMetadata)) return null

  const handleClick = () => {
    history.push(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
  }

  const locked = isLocked(certificateMetadata)

  const getText = () => {
    const replacedCertificateStatus = getReplacedCertificateStatus(certificateMetadata)

    switch (replacedCertificateStatus) {
      case CertificateStatus.SIGNED:
        return (
          <>
            {locked ? 'Utkastet' : 'Intyget'} har ersatts av{' '}
            <Link className={classes.link} onClick={handleClick}>
              detta intyg
            </Link>
          </>
        )
      case CertificateStatus.UNSIGNED:
        return (
          <>
            Det finns redan ett påbörjat utkast som ska ersätta detta {locked ? 'utkast' : 'intyg'}.{' '}
            <Link className={classes.link} onClick={handleClick}>
              Öppna utkastet
            </Link>
          </>
        )
      case CertificateStatus.REVOKED:
        return (
          <>
            {locked ? 'Utkastet' : 'Intyget'} ersattes av ett intyg som nu är makulerat.{' '}
            <Link className={classes.link} onClick={handleClick}>
              Öppna intyget
            </Link>
          </>
        )
      case CertificateStatus.LOCKED || CertificateStatus.LOCKED_REVOKED:
        return (
          <>
            Utkastet ersattes av ett utkast som nu är låst.{' '}
            <Link className={classes.link} onClick={handleClick}>
              Öppna utkastet
            </Link>
          </>
        )
    }
  }

  return <StatusWithIcon icon={'ErrorOutlineIcon'}>{getText()}</StatusWithIcon>
}

export default ReplacedStatus
