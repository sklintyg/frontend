import React from 'react'
import { useSelector } from 'react-redux'
import Category from './Category'
import Question from './Question'
import { CertificateFooter } from './CertificateFooter'
import {
  getCertificateDataElements,
  getIsShowSpinner,
  getSpinnerText,
} from '../../store/certificate/certificateSelectors'
import { Box, CircularProgress, Backdrop, Typography } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import grey from '@material-ui/core/colors/grey'
import UvCareUnitAddress from './CareUnit/UvCareUnitAddress'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `0px ${theme.spacing(2)}px 0px`,
    backgroundColor: grey[300],
    overflowY: 'auto',
    height: '100%',
    '& .questionWrapper + .questionWrapper .questionTitle': {
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: theme.typography.subtitle2.fontWeight,
    },
    '& .questionWrapper + .questionWrapper .MuiPaper-root': {
      paddingTop: 0,
    },
    '& .contentPaperWrapper': {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    '& .categoryWrapper + .questionWrapper .MuiPaper-root': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
}))

const Certificate: React.FC = () => {
  const certificateStructure = useSelector(getCertificateDataElements)
  const showSpinner = useSelector(getIsShowSpinner)
  const spinnerText = useSelector(getSpinnerText)
  const classes = useStyles()

  if (showSpinner)
    return (
      <Backdrop open={showSpinner}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress />
          <Typography variant='h1'>{spinnerText}</Typography>
        </Box>
      </Backdrop>
    )

  return (
    <Box id='questions-container' className={classes.root}>
      {certificateStructure &&
        certificateStructure.map((data) => {
          if (data.component === 'category') {
            return <Category key={data.id} id={data.id} />
          } else {
            return <Question key={data.id} id={data.id} />
          }
        })}

      <UvCareUnitAddress></UvCareUnitAddress>
      <CertificateFooter />
    </Box>
  )
}

export default Certificate
