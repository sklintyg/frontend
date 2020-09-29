import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Container, createStyles, Paper, Theme, Typography, useTheme } from '@material-ui/core'
import {
  getCertificateMetaData,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
} from '../../../store/certificate/certificateSelectors'
import PrintIcon from '@material-ui/icons/Print'
import DeleteIcon from '@material-ui/icons/Delete'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { CertificateStatus } from '@frontend/common'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CertificateHeaderStatus from './CertificateHeaderStatus'
import { deleteCertificate, printCertificate } from '../../../store/certificate/certificateActions'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: '0 2px 4px 0 rgba(0,0,0,.12)',
      borderBottom: '1px solid #d7d7dd',
    },
    statusWrapper: {
      marginTop: theme.spacing(1.25),
      marginBottom: theme.spacing(0.75),
      display: 'flex',
      alignItems: 'center',
    },
    certificateName: {
      fontWeight: theme.typography.fontWeightLight,
      marginTop: theme.spacing(1.25),
      fontSize: theme.typography.h5.fontSize,
    },
    patientTitle: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      margin: `0 0 ${theme.spacing(1)}px`,
    },
    buttonWrapper: {
      marginBottom: theme.spacing(0.5),
      alignItems: 'flex-end',
      '& button + button': {
        marginLeft: theme.spacing(1),
      },
    },
    statusLeftSide: {
      display: 'flex',
      flexGrow: 1,
      '& .headerStatusWrapper + .headerStatusWrapper': {
        marginLeft: theme.spacing(2),
      },
    },
  })
)

export const CertificateHeader: React.FC = (props) => {
  const certificateMetadata = useSelector(getCertificateMetaData)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const isShowSpinner = useSelector(getIsShowSpinner)
  const theme = useTheme()
  const dispatch = useDispatch()

  const classes = useStyles()

  if (!certificateMetadata || isShowSpinner) {
    return null
  }

  return (
    <Paper square className={classes.root}>
      <Container>
        <Box className={classes.statusWrapper}>
          <Box className={classes.statusLeftSide}>
            <CertificateHeaderStatus icon={isValidForSigning ? 'CheckIcon' : 'ErrorOutlineIcon'}>
              {certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED
                ? isValidForSigning
                  ? 'Klar att signera'
                  : 'Obligatoriska uppgifter saknas'
                : 'Intyget är skickat till Arbetsförmedlingen'}
            </CertificateHeaderStatus>

            {!isValidating && (
              <CertificateHeaderStatus icon={isValidating ? undefined : 'CheckIcon'}>
                {certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED
                  ? 'Utkastet är sparat'
                  : 'Intyget är tillgängligt för patienten'}
              </CertificateHeaderStatus>
            )}
          </Box>
          {certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED && (
            <Typography variant="body2">Utkastet skapades 2020-08-25 14:37</Typography>
          )}
        </Box>
        <Divider />
        <Box display="flex">
          <Box flexGrow="1">
            <Typography variant={'h2'} className={classes.certificateName}>
              {certificateMetadata.certificateName}
            </Typography>
            <Typography variant="h3" className={classes.patientTitle}>
              Tolvan Tolvansson - 19121212-1212
            </Typography>
          </Box>
          <Box display="flex" className={classes.buttonWrapper}>
            {certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED ? (
              <Box>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  startIcon={<PrintIcon />}
                  onClick={() => dispatch(printCertificate(certificateMetadata))}>
                  Skriv ut
                </Button>
                <Button
                  variant={'contained'}
                  startIcon={<DeleteIcon />}
                  onClick={() => dispatch(deleteCertificate(certificateMetadata.certificateId))}>
                  Radera
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PrintIcon />}
                  onClick={() => dispatch(printCertificate(certificateMetadata))}>
                  Skriv ut
                </Button>
                <Button variant="contained" color="primary" startIcon={<SyncAltIcon />}>
                  Ersätt
                </Button>
                <Button variant="contained" startIcon={<DeleteIcon />}>
                  Makulera
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Paper>
  )
}
