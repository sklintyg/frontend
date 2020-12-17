import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import PrintIcon from '@material-ui/icons/Print'
import { CustomButton } from '@frontend/common'

interface Props {
  name: string
  description: string
  enabled: boolean
}

const PrintCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)

  if (!certificateMetadata) return null

  return (
    <CustomButton
      tooltip={description}
      disabled={!enabled}
      style="primary"
      text={name}
      startIcon={<PrintIcon />}
      onClick={() => dispatch(printCertificate(certificateMetadata))}
    />
  )
}

export default PrintCertificateButton
