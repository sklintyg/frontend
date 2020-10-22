import React from 'react'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import { useHistory } from 'react-router-dom'
import { ButtonWithConfirmModal } from '@frontend/common'
import { InfoBox, isReplaced, isReplacingCertificateRevoked } from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import { replaceCertificate } from '../../../store/certificate/certificateActions'
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

const ReplaceCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)
  const historyEntries = useSelector(getCertificateEvents)
  const {
    palette: {
      primary: { light },
    },
  } = useTheme()

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
      return () => dispatch(replaceCertificate(history))
    }
  }

  return (
    <ButtonWithConfirmModal
      additionalButtonStyles={classes.button}
      additionalConfirmButtonStyles={classes.button}
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<SyncAltIcon />}
      modalTitle="Ersätt intyg"
      onConfirm={handleConfirm()}
      confirmButtonText={isCertReplaced ? 'Fortsätt på utkast' : 'Ersätt'}>
      <>
        <InfoBox type="info">
          Om intyget innehåller ett allvarligt fel, till exempel om det är utfärdat på fel patient, bör du istället makulera intyget.
        </InfoBox>
        <Typography>
          Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades. När
          ett intyg ersätts med ett nytt skapas ett utkast, med samma information som i det ursprungliga intyget, som du kan redigera innan
          du signerar intyget.
        </Typography>
      </>
    </ButtonWithConfirmModal>
  )
}

export default ReplaceCertificateButton
