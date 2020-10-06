import { makeStyles, Paper, Typography, Link } from '@material-ui/core'
import React from 'react'
import SchoolIcon from '@material-ui/icons/School'

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#00a9a7',
    position: 'sticky',
    bottom: '0',
    padding: theme.spacing(2.5),
  },
  border: {
    border: '1px solid #cdced6',
  },
  contentText: {
    whiteSpace: 'pre-line',
    marginTop: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
  },
  textWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    fontSize: '14px',
    color: 'inherit',
  },
}))

const CertificateAboutFooter = () => {
  const classes = useStyles()

  return (
    <Paper square className={`${classes.root} ${classes.border}`}>
      <Link className={classes.link} target="_blank" href={'https://www.inera.se/intygsskolan/webcert'}>
        <div className={classes.textWrapper}>
          <SchoolIcon style={{ marginRight: '5px' }} />
          <Typography className={classes.link}>Hitta svar på dina frågor i Ineras intygsskola</Typography>
        </div>
      </Link>
    </Paper>
  )
}

export default CertificateAboutFooter
