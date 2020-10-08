import { CertificateMetadata, isReplaced } from '@frontend/common'
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

  return (
    <CertificateHeaderStatus icon={'ErrorOutlineIcon'}>
      Det finns redan ett påbörjat utkast som ska ersätta detta intyg.{' '}
      <Link className={classes.link} onClick={handleClick}>
        Öppna utkastet
      </Link>
    </CertificateHeaderStatus>
  )
}

export default ReplacedStatus
