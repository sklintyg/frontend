import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  getCertificateEvents,
  getResourceLinks,
  getCertificateMetaData,
  getIsShowSpinner,
  getIsValidating,
  getIsValidForSigning,
  getIsLocked,
} from '../../../store/certificate/certificateSelectors'
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
import LockedStatus from './Status/LockedStatus'
import styled from 'styled-components'
import { Divider } from '@frontend/common'

// const useStyles = makeStyles((theme) => ({
//   root: {
//     boxShadow: '0 2px 4px 0 rgba(0,0,0,.12)',
//     borderBottom: '1px solid #d7d7dd',
//   },
//   statusWrapper: {
//     marginTop: theme.spacing(1.25),
//     marginBottom: theme.spacing(0.75),
//     display: 'flex',
//     alignItems: 'center',
//   },
//   buttonWrapper: {
//     marginBottom: theme.spacing(0.5),
//     alignItems: 'flex-end',
//     '& button + button': {
//       marginLeft: theme.spacing(1),
//     },
//   },
//   statusLeftSide: {
//     display: 'flex',
//     flexGrow: 1,
//     '& .status + .status': {
//       marginLeft: theme.spacing(2),
//     },
//   },
// }))

const Wrapper = styled.section`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid #d7d7dd;
`

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StatusLeftSide = styled.div`
  display: flex;
  flex-grow: 1;

  .status + .status {
    margin-left: 16px;
  }
`

export const CertificateHeader: React.FC = (props) => {
  const certificateMetadata = useSelector(getCertificateMetaData)
  const historyEntries = useSelector(getCertificateEvents)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const isValidating = useSelector(getIsValidating)
  const isShowSpinner = useSelector(getIsShowSpinner)
  const resourceLinks = useSelector(getResourceLinks)
  const isLocked = useSelector(getIsLocked)

  if (!certificateMetadata || isShowSpinner || !resourceLinks) {
    return null
  }

  return (
    <Wrapper>
      <div className="ic-container">
        <StatusWrapper>
          <StatusLeftSide>
            <RevokedStatus certificateMetadata={certificateMetadata} />
            <SignableStatus certificateMetadata={certificateMetadata} isValidForSigning={isValidForSigning} />
            <DraftSavedStatus certificateMetadata={certificateMetadata} isValidating={isValidating} isEditable={!isLocked} />
            <SentStatus certificateMetadata={certificateMetadata} />
            <ReplacedStatus certificateMetadata={certificateMetadata} />
            <AvailableForPatientStatus certificateMetadata={certificateMetadata} />
            <RevokeParentStatus certificateMetadata={certificateMetadata} />
            <LockedStatus certificateMetadata={certificateMetadata} />
          </StatusLeftSide>
          <ShowHistory historyEntries={historyEntries} certificateMetadata={certificateMetadata} />
        </StatusWrapper>
        <Divider />
        <div className="iu-flex">
          <CertificateInfo certificateMetadata={certificateMetadata} />
          <HeaderButtons resourceLinks={resourceLinks} />
        </div>
      </div>
    </Wrapper>
  )
}
