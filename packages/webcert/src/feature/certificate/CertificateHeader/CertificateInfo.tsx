import { CertificateMetadata } from '@frontend/common'
import { makeStyles, Theme, Box, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  certificateName: {
    fontWeight: theme.typography.fontWeightLight,
    marginTop: theme.spacing(1.25),
    fontSize: theme.typography.h5.fontSize,
  },
  patientTitle: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    margin: `0 0 ${theme.spacing(1)}px`,
  },
}))

interface Props {
  certificateMetadata: CertificateMetadata
}

const CertificateInfo: React.FC<Props> = ({ certificateMetadata }) => {
  const classes = useStyles()

  return (
    <Box flexGrow="1">
      <Typography variant={'h2'} className={classes.certificateName}>
        {certificateMetadata.certificateName}
      </Typography>
      <Typography variant="h3" className={classes.patientTitle}>
        {certificateMetadata.patient.fullName} - {certificateMetadata.patient.personId}
      </Typography>
    </Box>
  )
}

export default CertificateInfo
