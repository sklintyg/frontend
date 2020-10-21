import { Button, useTheme } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { printCertificate } from '../../../store/certificate/certificateActions'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import PrintIcon from '@material-ui/icons/Print'
import { ButtonTooltip } from '@frontend/common'

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
    <ButtonTooltip description={description}>
      <Button
        disabled={!enabled}
        variant={'contained'}
        style={{ backgroundColor: light, color: 'white' }}
        startIcon={<PrintIcon />}
        onClick={() => dispatch(printCertificate(certificateMetadata))}>
        {name}
      </Button>
    </ButtonTooltip>
  )
}

export default PrintCertificateButton
