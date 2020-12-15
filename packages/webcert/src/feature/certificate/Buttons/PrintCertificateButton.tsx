import { Button, useTheme } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import PrintIcon from '@material-ui/icons/Print'
import { ButtonTooltip, CustomButton } from '@frontend/common'

interface Props {
  name: string
  description: string
  enabled: boolean
}

const PrintCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)
  const {
    palette: {
      primary: { light },
    },
  } = useTheme()

  if (!certificateMetadata) return null

  return (
    <CustomButton
      tooltip={description}
      disabled={!enabled}
      variant={'contained'}
      style="primary"
      text={name}
      startIcon={<PrintIcon />}
      onClick={() => dispatch(printCertificate(certificateMetadata))}
    />
  )
}

export default PrintCertificateButton
