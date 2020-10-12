import { CertificateMetadata, isReplaced, getReplacedCertificateStatus, CertificateStatus } from '@frontend/common'
import { Link, makeStyles } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'
import CertificateHeaderStatus from './CertificateHeaderStatus'

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

  const getText = () => {
    const replacedCertificateStatus = getReplacedCertificateStatus(certificateMetadata)

    switch (replacedCertificateStatus) {
      case CertificateStatus.SIGNED:
        return (
          <>
            Intyget har ersatts av{' '}
            <Link className={classes.link} onClick={handleClick}>
              detta intyg
            </Link>
          </>
        )
      case CertificateStatus.UNSIGNED:
        return (
          <>
            Det finns redan ett påbörjat utkast som ska ersätta detta intyg.{' '}
            <Link className={classes.link} onClick={handleClick}>
              Öppna utkastet
            </Link>
          </>
        )
      case CertificateStatus.INVALIDATED:
        return (
          <>
            Intyget ersattes av ett intyg som nu är makulerat.{' '}
            <Link className={classes.link} onClick={handleClick}>
              Öppna intyget
            </Link>
          </>
        )
    }
  }

  return <CertificateHeaderStatus icon={'ErrorOutlineIcon'}>{getText()}</CertificateHeaderStatus>
}

export default ReplacedStatus
