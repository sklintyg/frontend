import * as React from 'react'
import { useSelector } from 'react-redux'
import { Box, Container, Paper } from '@material-ui/core'
import {
  getCertificateMetaData,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
} from '../../../store/certificate/certificateSelectors'
import Divider from '@material-ui/core/Divider'
import { CertificateStatus } from '@frontend/common'
import makeStyles from '@material-ui/core/styles/makeStyles'
import RevokeCertificateButton from '../Buttons/RevokeCertificateButton'
import DeleteCertificateButton from '../Buttons/DeleteCertificateButton'
import PrintCertificateButton from '../Buttons/PrintCertificateButton'
import ReplaceCertificateButton from '../Buttons/ReplaceCertificateButton'
import AvailableForPatientStatus from './Status/AvailableForPatientStatus'
import RevokedStatus from './Status/RevokedStatus'
import DraftSavedStatus from './Status/DraftSavedStatus'
import SignableStatus from './Status/SignableStatus'
import SentStatus from './Status/SentStatus'
import ReplacedStatus from './Status/ReplacedStatus'
import ShowHistory from './ShowHistory'
import CertificateInfo from './CertificateInfo'

const useStyles = makeStyles((theme) => ({
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
}))

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
          <Box className={classes.statusLeftSide}>
            <RevokedStatus certificateMetadata={certificateMetadata} />
            <DraftSavedStatus certificateMetadata={certificateMetadata} isValidating={isValidating} />
            <SignableStatus certificateMetadata={certificateMetadata} isValidForSigning={isValidForSigning} />
            <SentStatus certificateMetadata={certificateMetadata} />
            <ReplacedStatus certificateMetadata={certificateMetadata} />
            <AvailableForPatientStatus certificateMetadata={certificateMetadata} />
          </Box>
          {/* //TODO: These history entries need to come from metadata */}
          <ShowHistory
            historyEntries={[
              '2020-10-07 11:56 Intyget är tillgängligt för patienten',
              '2020-10-07 11:56 Intyget är signerat',
              '2020-10-07 10:25 Intyget är skapat',
            ]}
          />
        </Box>
        <Divider />
        <Box display="flex">
          <CertificateInfo certificateMetadata={certificateMetadata} />
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
