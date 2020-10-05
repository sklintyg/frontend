import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Container, createStyles, Link, Paper, Theme, Typography, useTheme } from '@material-ui/core'
import {
  getCertificateMetaData,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
} from '../../../store/certificate/certificateSelectors'
import Divider from '@material-ui/core/Divider'
import { CertificateStatus } from '@frontend/common'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CertificateHeaderStatus from './CertificateHeaderStatus'
import RevokeCertificateButton from '../Buttons/RevokeCertificateButton'
import DeleteCertificateButton from '../Buttons/DeleteCertificateButton'
import PrintCertificateButton from '../Buttons/PrintCertificateButton'
import ReplaceCertificateButton from '../Buttons/ReplaceCertificateButton'

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
            <CertificateHeaderStatus
              icon={
                isValidForSigning || certificateMetadata.certificateStatus === CertificateStatus.SIGNED ? 'CheckIcon' : 'ErrorOutlineIcon'
              }>
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
            //TODO: add certificate history link below with modal containing the history
            <Typography variant="body2">
              <Link href="#">Visa historik</Link>
            </Typography>
          )}
        </Box>
        <Divider />
        <Box display="flex">
          <Box flexGrow="1">
            <Typography variant={'h2'} className={classes.certificateName}>
              {certificateMetadata.certificateName}
            </Typography>
            <Typography variant="h3" className={classes.patientTitle}>
              {certificateMetadata.patient.fullName} - {certificateMetadata.patient.personId}
            </Typography>
          </Box>
          <Box display="flex" className={classes.buttonWrapper}>
            {certificateMetadata.certificateStatus === CertificateStatus.UNSIGNED ? (
              <Box>
                <PrintCertificateButton />
                <DeleteCertificateButton />
              </Box>
            ) : (
              certificateMetadata.certificateStatus === CertificateStatus.SIGNED && (
                <Box>
                  <PrintCertificateButton />
                  <ReplaceCertificateButton />
                  <RevokeCertificateButton />
                </Box>
              )
            )}
          </Box>
        </Box>
      </Container>
    </Paper>
  )
}
