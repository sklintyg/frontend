import * as React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { getResourceLink, resourceLinksAreEqual, ResourceLinkType } from '@frontend/common'
import { getCertificateMetaData, getResourceLinks } from '../../store/certificate/certificateSelectors'
import Typography from '@material-ui/core/Typography'
import SignAndSendButton from './Buttons/SignAndSendButton'

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

export const CertificateFooter: React.FC = () => {
  const certificateMetadata = useSelector(getCertificateMetaData)
  const resourceLinks = useSelector(getResourceLinks)
  const classes = useStyles()

  if (!certificateMetadata || !resourceLinks) return null

  //TODO: we're overwiting this until we've added more data from the backend. Otherwise the button says "Signera" only.
  // Currently we got two links, "sign" and "send", and we're only checking for sign here.
  // This works currently because AF00213 only supports a combination of sign and send.

  return (
    <div className={classes.root}>
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.SIGN_CERTIFICATE)) && (
        <SignAndSendButton {...{ ...getResourceLink(resourceLinks, ResourceLinkType.SIGN_CERTIFICATE), name: 'Signera och skicka' }} />
      )}

      <Typography className={classes.idText}>Intygs-ID: {certificateMetadata.certificateId}</Typography>
    </div>
  )
}
