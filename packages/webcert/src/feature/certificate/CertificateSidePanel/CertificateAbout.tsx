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

  // TODO: This string should be fetched from some source
  const string = `Arbetsförmedlingen behöver ett medicinskt utlåtande för en arbetssökande som har ett behov av fördjupat stöd.

    Vi behöver ett utlåtande för att kunna:
  
    • utreda och bedöma om den arbetssökande har en funktionsnedsättning som medför nedsatt arbetsförmåga
    • bedöma om vi behöver göra anpassningar i program eller insatser
    • erbjuda lämpliga utredande, vägledande, rehabiliterande eller arbetsförberedande insatser.`

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
        <Typography className={classes.contentText}>{string}</Typography>
      </div>
      <CertificateAboutFooter />
    </>
  )
}

export default CertificateAbout
