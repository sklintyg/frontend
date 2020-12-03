import { ResourceLink, ResourceLinkType, resourceLinksAreEqual, getResourceLink } from '@frontend/common'
import { Box, Button, makeStyles } from '@material-ui/core'
import React from 'react'
import RemoveCertificateButton from '../Buttons/RemoveCertificateButton'
import PrintCertificateButton from '../Buttons/PrintCertificateButton'
import ReplaceCertificateButton from '../Buttons/ReplaceCertificateButton'
import RevokeCertificateButton from '../Buttons/RevokeCertificateButton'
import CopyCertificateButton from '../Buttons/CopyCertificateButton'
import { useDispatch } from 'react-redux'
import { getFMBDiagnosisCodeInfo } from '../../../store/fmb/fmbActions'

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    marginBottom: theme.spacing(0.5),
    alignItems: 'flex-end',
    '& button + button': {
      marginLeft: theme.spacing(1),
    },
  },
}))

interface Props {
  resourceLinks: ResourceLink[]
}

//TODO: Erik: Ta bort knapparna

const HeaderButtons: React.FC<Props> = ({ resourceLinks }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleJ20FMB = () => {
    dispatch(getFMBDiagnosisCodeInfo('J20'))
  }

  const handleF500FMB = () => {
    dispatch(getFMBDiagnosisCodeInfo('F500'))
  }

  return (
    <Box display="flex" className={classes.buttonWrapper}>
      <Button onClick={handleJ20FMB}>Get FMB for J20</Button>
      <Button onClick={handleF500FMB}>Get FMB for F500</Button>
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.COPY_CERTIFICATE)) && (
        <CopyCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.COPY_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.PRINT_CERTIFICATE)) && (
        <PrintCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.PRINT_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REPLACE_CERTIFICATE)) && (
        <ReplaceCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.REPLACE_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REMOVE_CERTIFICATE)) && (
        <RemoveCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.REMOVE_CERTIFICATE)} />
      )}
      {resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.REVOKE_CERTIFICATE)) && (
        <RevokeCertificateButton {...getResourceLink(resourceLinks, ResourceLinkType.REVOKE_CERTIFICATE)} />
      )}
    </Box>
  )
}

export default HeaderButtons
