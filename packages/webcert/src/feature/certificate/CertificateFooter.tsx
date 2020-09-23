import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { CertificateStatus } from '@frontend/common'
import { getCertificateMetaData, getIsValidating } from '../../store/certificate/certificateSelectors'
import { signCertificate } from '../../store/certificate/certificateActions'
import Typography from '@material-ui/core/Typography'
import BorderColorIcon from '@material-ui/icons/BorderColor';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px 0`,
  },
  signButton: {
    backgroundColor: '#4c7b67',
    borderColor: '#4c7b67',
    color: '#fff',
  },
  idText: {
    marginLeft: 'auto',
    fontSize: theme.typography.fontSize,
  },
}))

export const CertificateFooter: React.FC = (props) => {
  const certificateMetadata = useSelector(getCertificateMetaData)
  const isValidating = useSelector(getIsValidating)

  const dispatch = useDispatch()

  const classes = useStyles()

  if (!certificateMetadata) return null

  return (
    <div className={classes.root}>
      {certificateMetadata.status === CertificateStatus.UNSIGNED && (
        <Button
          className={classes.signButton}
          startIcon={<BorderColorIcon/>}
          disabled={isValidating}
          variant="contained"
          onClick={() => {
            dispatch(signCertificate())
          }}>
          Signera och skicka
        </Button>
      )}
      <Typography className={classes.idText}>Intygs-ID: {certificateMetadata.certificateId}</Typography>
    </div>
  )
}
