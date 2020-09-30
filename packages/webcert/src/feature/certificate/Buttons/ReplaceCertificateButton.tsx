import { Button } from '@material-ui/core'
import React from 'react'
import SyncAltIcon from '@material-ui/icons/SyncAlt'

interface Props {}

const ReplaceCertificateButton = (props: Props) => {
  return (
    <Button variant="contained" color="primary" startIcon={<SyncAltIcon />}>
      Ersätt
    </Button>
  )
}

export default ReplaceCertificateButton
