import * as React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { getResourceLink, resourceLinksAreEqual, ResourceLinkType, StatusWithIcon } from '@frontend/common'
import { getCertificateMetaData, getIsValidForSigning, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import Typography from '@material-ui/core/Typography'
import SignAndSendButton from '../Buttons/SignAndSendButton'
import colors from '../../../components/styles/colors'
import ForwardCertificateButton from '../Buttons/ForwardCertificateButton'
import ShowValidationErrorsSwitch from './ShowValidationErrorsSwitch'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: `${theme.spacing(2)}px 0`,
    justifyContent: 'space-between',
  },
  signButton: {
    backgroundColor: colors.IA_COLOR_17,
    borderColor: colors.IA_COLOR_17,
    color: '#fff',
  },
  idText: {
    fontSize: theme.typography.fontSize,
  },
  statusWrapper: {
    marginLeft: theme.spacing(2),
  },
  leftWrapper: {
    display: 'flex',
  },
  rightWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'flex-end',
  },
}))

export const CertificateFooter: React.FC = () => {
  const certificateMetadata = useSelector(getCertificateMetaData)
  const resourceLinks = useSelector(getResourceLinks)
  const isValidForSigning = useSelector(getIsValidForSigning)
  const classes = useStyles()

  if (!certificateMetadata || !resourceLinks) return null

  //TODO: we're overwiting this until we've added more data from the backend. Otherwise the button says "Signera" only.
  // Currently we got two links, "sign" and "send", and we're only checking for sign here.
  // This works currently because AF00213 only supports a combination of sign and send.

  const canSign = resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE))
  const canForward =
    resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.FORWARD_CERTIFICATE)) &&
    !resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE))

  return (
    <div className={classes.root}>
      {canSign && (
        <div className={classes.leftWrapper}>
          <SignAndSendButton {...{ ...getResourceLink(resourceLinks, ResourceLinkType.SIGN_CERTIFICATE), name: 'Signera och skicka' }} />
        </div>
      )}

      {canForward && (
        <div className={classes.leftWrapper}>
          <ForwardCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.FORWARD_CERTIFICATE)} />
          {certificateMetadata.forwarded && (
            <StatusWithIcon icon="CheckIcon" additionalWrapperStyles={classes.statusWrapper}>
              Vidarebefordrat
            </StatusWithIcon>
          )}
        </div>
      )}
      <div className={classes.rightWrapper}>
        {canForward && !isValidForSigning && <ShowValidationErrorsSwitch />}
        <Typography className={classes.idText}>Intygs-ID: {certificateMetadata.certificateId}</Typography>
      </div>
    </div>
  )
}
