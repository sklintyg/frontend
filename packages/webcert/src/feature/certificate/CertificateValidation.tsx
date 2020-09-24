import { makeStyles, Paper, Typography } from '@material-ui/core'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { getAllValidationErrors, getShowValidationErrors } from '../../store/certificate/certificateSelectors'
import WarningIcon from '@material-ui/icons/Warning'
import { Link } from "react-scroll";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  infoWrapper: {
    background: theme.palette.warning.light,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    color: theme.palette.warning.dark,
  },
  infoText: {
    marginLeft: theme.spacing(1),
  },
  link: {
    color: theme.palette.warning.main,
    fontSize: theme.typography.body1.fontSize,
    textDecoration: 'underline',
    cursor: 'pointer',
    '& :first-letter': {
      textTransform: 'capitalize',
    },
  },
  linksWrapper: {
    marginTop: theme.spacing(1),
  },
}))

interface CertificateValidationProps {}

const CertificateValidation: React.FC<CertificateValidationProps> = (props) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getAllValidationErrors())
  const classes = useStyles()

  if(!validationErrors || validationErrors.length === 0 || !isShowValidationError) return null


  const validationMessages = validationErrors.map((validation, i) => {
    return (
      <Typography key={i}>
        <Link className={classes.link} duration={250} smooth offset={-20} containerId="questions-container" to={`${validation.id}`}>{validation.config.text}</Link>
      </Typography>
    )
  })

  return (
    <Paper className={`${classes.root} contentPaperWrapper`}>
      <div className={classes.infoWrapper}>
        <WarningIcon></WarningIcon>
        <Typography className={classes.infoText}>Utkastet saknar uppgifter i följande avsnitt:</Typography>
      </div>
      <div className={classes.linksWrapper}>{validationMessages}</div>
    </Paper>
  )
}

export default CertificateValidation
