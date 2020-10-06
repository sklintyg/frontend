import { makeStyles, Paper, Typography, Link } from '@material-ui/core'
import React from 'react'
import SchoolIcon from '@material-ui/icons/School'

const useStyles = makeStyles((theme) => ({
  contentText: {
    whiteSpace: 'pre-line',
    marginTop: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
  },
  border: {
    border: '1px solid #cdced6',
  },
  helpWrapper: {
    color: '#00a9a7',
    position: 'sticky',
    bottom: '0',
    padding: theme.spacing(2.5),
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
  },
  link: {
    fontSize: '14px',
    display: 'inline-block',
    color: 'inherit',
  },
}))

const SidePanelFooter = () => {
  const classes = useStyles()

  return (
    <Paper square className={`${classes.helpWrapper} ${classes.border}`}>
      <Typography className={classes.text}>
        <SchoolIcon style={{ marginRight: '5px' }} />
        <Link className={classes.link} href={'#'}>
          Hitta svar på dina frågor i Ineras intygsskola
        </Link>
      </Typography>
    </Paper>
  )
}

export default SidePanelFooter
