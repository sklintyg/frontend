import React from 'react'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal } from '@frontend/common'
import { InfoBox, isReplaced, isReplacingCertificateRevoked } from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { copyCertificate } from '../../../store/certificate/certificateActions'
import { makeStyles, Typography, useTheme } from '@material-ui/core'
import { getCertificateEvents, getCertificateMetaData } from '../../../store/certificate/certificateSelectors'

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
  },
}))

interface Props {
  name: string
  description: string
  enabled: boolean
}

const CopyCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)
  const historyEntries = useSelector(getCertificateEvents)

  if (!certificateMetadata) return null

  let isCertReplaced = isReplaced(certificateMetadata)

  if (isCertReplaced) {
    const replacingIsRevoked = isReplacingCertificateRevoked(historyEntries)

    if (replacingIsRevoked) {
      isCertReplaced = false
    }
  }

  const handleConfirm = () => {
    if (isCertReplaced) {
      return () => history.push(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
    } else {
      return () => dispatch(copyCertificate(history))
    }
  }

  return (
    <ButtonWithConfirmModal
      additionalButtonStyles={classes.button}
      additionalConfirmButtonStyles={classes.button}
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<FileCopyIcon />}
      modalTitle="Kopiera låst utkast"
      onConfirm={handleConfirm()}
      confirmButtonText={isCertReplaced ? 'Fortsätt på utkast' : 'Kopiera'}>
      <>
        <Typography>
          Genom att koiera ett låst intygsutkast skapas ett nytt utkast med samma information som i det ursprungliga låsta utkastet. Du kan
          redigera utkastet innan du signerar det. Det ursprungliga låsta utkastet finns kvar.
        </Typography>
      </>
    </ButtonWithConfirmModal>
  )
}

export default CopyCertificateButton
