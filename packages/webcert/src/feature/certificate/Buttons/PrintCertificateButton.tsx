import { Button, useTheme } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import PrintIcon from '@material-ui/icons/Print'

const PrintCertificateButton = () => {
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)
  const {
    palette: {
      primary: { light },
    },
  } = useTheme()

  if (!certificateMetadata) return null

  return (
    <Button
      variant={'contained'}
      style={{ backgroundColor: light, color: 'white' }}
      startIcon={<PrintIcon />}
      onClick={() => dispatch(printCertificate(certificateMetadata))}>
      Skriv ut
    </Button>
  )
}

export default PrintCertificateButton
