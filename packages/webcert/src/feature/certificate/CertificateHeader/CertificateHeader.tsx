import * as React from 'react'
import { useSelector } from 'react-redux'
import { Box, Container, Paper } from '@material-ui/core'
import {
  getCertificateEvents,
  getResourceLinks,
  getCertificateMetaData,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
} from '../../../store/certificate/certificateSelectors'
import Divider from '@material-ui/core/Divider'
import makeStyles from '@material-ui/core/styles/makeStyles'
import AvailableForPatientStatus from './Status/AvailableForPatientStatus'
import RevokedStatus from './Status/RevokedStatus'
import DraftSavedStatus from './Status/DraftSavedStatus'
import SignableStatus from './Status/SignableStatus'
import SentStatus from './Status/SentStatus'
import ReplacedStatus from './Status/ReplacedStatus'
import ShowHistory from './ShowHistory'
import CertificateInfo from './CertificateInfo'
import RevokeParentStatus from './Status/RevokeParentStatus'
import HeaderButtons from './HeaderButtons'

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
    '& .status + .status': {
      marginLeft: theme.spacing(2),
    },
  },
}))

export const CertificateHeader: React.FC = (props) => {
  const certificateMetadata = useSelector(getCertificateMetaData)
  const historyEntries = useSelector(getCertificateEvents)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const isShowSpinner = useSelector(getIsShowSpinner)
  const resourceLinks = useSelector(getResourceLinks)

  const classes = useStyles()

  if (!certificateMetadata || isShowSpinner || !resourceLinks) {
    return null
  }

  return (
    <Paper square className={classes.root}>
      <Container>
        <Box className={classes.statusWrapper}>
          <Box className={classes.statusLeftSide}>
            <RevokedStatus certificateMetadata={certificateMetadata} />
            <SignableStatus certificateMetadata={certificateMetadata} isValidForSigning={isValidForSigning} />
            <DraftSavedStatus certificateMetadata={certificateMetadata} isValidating={isValidating} />
            <SentStatus certificateMetadata={certificateMetadata} />
            <ReplacedStatus certificateMetadata={certificateMetadata} />
            <AvailableForPatientStatus certificateMetadata={certificateMetadata} />
            <RevokeParentStatus certificateMetadata={certificateMetadata} />
          </Box>
          <ShowHistory historyEntries={historyEntries} certificateMetadata={certificateMetadata} />
        </Box>
        <Divider />
        <Box display="flex">
          <CertificateInfo certificateMetadata={certificateMetadata} />
          <HeaderButtons resourceLinks={resourceLinks} />
        </Box>
      </Container>
    </Paper>
  )
}
