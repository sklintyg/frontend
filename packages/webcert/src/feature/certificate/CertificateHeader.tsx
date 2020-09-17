import * as React from 'react'
import { useSelector } from 'react-redux'
import { Box, Container, createStyles, Paper, Theme, Typography } from '@material-ui/core'
import { getCertificateMetaData, getIsShowSpinner, getIsValidating, getIsValidForSigning } from '../../store/selectors/certificate'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import PrintIcon from '@material-ui/icons/Print'
import DeleteIcon from '@material-ui/icons/Delete'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import CheckIcon from '@material-ui/icons/Check'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { CertificateStatus } from '@frontend/common'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: '0 2px 4px 0 rgba(0,0,0,.12)',
      borderBottom: '1px solid #d7d7dd',
    },
    margin: {
      marginLeft: theme.spacing(1),
    },
    statusWrapper: {
      marginTop: theme.spacing(1.25),
      marginBottom: theme.spacing(0.75),
      display: 'flex',
      alignItems: 'center',
    },
    certificateName: {
      fontWeight: theme.typography.fontWeightLight,
      marginTop: '10px',
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
    },
  })
)

export const CertificateHeader: React.FC = (props) => {
  const certificateMetadata = useSelector(getCertificateMetaData)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const isShowSpinner = useSelector(getIsShowSpinner)

  const classes = useStyles()

  if (!certificateMetadata || isShowSpinner) {
    return null
  }

  return (
    <Paper square className={classes.root}>
      <Container>
        <Box className={classes.statusWrapper}>
          {isValidForSigning ? (
            <Box clone color="green">
              <CheckIcon fontSize="small" />
            </Box>
          ) : (
            <ErrorOutlineIcon color="error" fontSize="small" />
          )}
          <Box marginLeft="5px" marginRight="30px" flexGrow={isValidating ? 1 : 0}>
            <Typography variant="body2">
              {certificateMetadata.status === CertificateStatus.UNSIGNED
                ? isValidForSigning
                  ? 'Klar att signera'
                  : 'Obligatoriska uppgifter saknas'
                : 'Intyget är skickat till Arbetsförmedlingen'}
            </Typography>
          </Box>
          {!isValidating && (
            <>
              <Box clone color="green">
                <CheckIcon fontSize="small" />
              </Box>
              <Box flexGrow="1">
                <Typography variant="body2">
                  {certificateMetadata.status === CertificateStatus.UNSIGNED
                    ? 'Utkastet är sparat'
                    : 'Intyget är tillgängligt för patienten'}
                </Typography>
              </Box>
            </>
          )}
          {certificateMetadata.status === CertificateStatus.UNSIGNED && (
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
            {certificateMetadata.status === CertificateStatus.UNSIGNED ? (
              <Box>
                <Button variant={'contained'} color={'primary'} startIcon={<PrintIcon />}>
                  Skriv ut
                </Button>
                <Button className={classes.margin} variant={'contained'} startIcon={<DeleteIcon />}>
                  Radera
                </Button>
              </Box>
            ) : (
              <Box>
                <Button variant={'contained'} color={'primary'} startIcon={<PrintIcon />}>
                  Skriv ut
                </Button>
                <Button variant={'contained'} color={'primary'} className={classes.margin} startIcon={<SyncAltIcon />}>
                  Ersätt
                </Button>
                <Button variant={'contained'} className={classes.margin} startIcon={<DeleteIcon />}>
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
