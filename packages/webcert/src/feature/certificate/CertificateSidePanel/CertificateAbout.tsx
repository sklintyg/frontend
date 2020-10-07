import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import CertificateAboutFooter from './CertificateAboutFooter'

const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  contentText: {
    whiteSpace: 'pre-line',
    marginTop: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
  },
  border: {
    border: '1px solid #cdced6',
  },
  certificateType: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  certificateVersion: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.subtitle2.fontSize,
    marginLeft: theme.spacing(1),
    textTransform: 'uppercase',
  },
}))

const CertificateAbout = () => {
  const certMetaData = useSelector(getCertificateMetaData)
  const classes = useStyles()

  return (
    <>
      <div className={`${classes.contentWrapper} ${classes.border}`}>
        <Typography className={classes.certificateType}>
          {certMetaData && (
            <>
              {certMetaData.certificateName}
              <span className={classes.certificateVersion}>
                {certMetaData.certificateType} {certMetaData.certificateTypeVersion}
              </span>
            </>
          )}
        </Typography>
        <Typography className={classes.contentText}>{certMetaData && certMetaData.certificateDescription}</Typography>
      </div>
      <CertificateAboutFooter />
    </>
  )
}

export default CertificateAbout
