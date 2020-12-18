import { makeStyles, Paper, Typography, Link } from '@material-ui/core'
import React from 'react'
import SchoolIcon from '@material-ui/icons/School'
import colors from '../../../components/styles/colors'
import LaunchIcon from '@material-ui/icons/Launch'
import WCDynamicLink from '../../../components/utils/WCDynamicLink'

const useStyles = makeStyles((theme) => ({
  root: {
    color: colors.WC_COLOR_31,
    position: 'sticky',
    bottom: '0',
    padding: theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${colors.IA_COLOR_08}`,
  },
  schoolIcon: {
    marginRight: theme.spacing(0.5),
  },
  launchIcon: {
    fontSize: 'small',
    marginLeft: theme.spacing(0.5),
  },
}))

const AboutCertificatePanelFooter = () => {
  const classes = useStyles()

  return (
    <Paper square className={classes.root}>
      <SchoolIcon className={classes.schoolIcon} />
      <WCDynamicLink linkKey={'ineraIntygsskola'} />
      <LaunchIcon className={classes.launchIcon} />
    </Paper>
  )
}

export default AboutCertificatePanelFooter
