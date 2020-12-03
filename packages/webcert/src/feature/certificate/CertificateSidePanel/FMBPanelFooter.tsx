import { makeStyles, Paper } from '@material-ui/core'
import React from 'react'
import LaunchIcon from '@material-ui/icons/Launch'
import sosLogo from './socialstyrelsen.png'
import colors from '../../../components/styles/colors'
import DynamicLink from '@frontend/common/src/components/utils/DynamicLink'

const useStyles = makeStyles((theme) => ({
  root: {
    color: colors.IA_COLOR_00,
    backgroundColor: colors.IA_COLOR_02,
    position: 'sticky',
    bottom: '0',
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  textWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  logoWrapper: {
    marginLeft: 'auto',
    width: '40px',
    height: '26px',
  },
  icon: {
    fontSize: 'small',
    marginLeft: theme.spacing(0.5),
  },
}))

const FMBPanelFooter: React.FC = () => {
  const classes = useStyles()

  return (
    <Paper square className={classes.root}>
      <div className={classes.textWrapper}>
        <DynamicLink linkKey={'fmbSoc'} />
        <LaunchIcon className={classes.icon} />
        <div className={classes.logoWrapper}>
          <img alt="" src={sosLogo} />
        </div>
      </div>
    </Paper>
  )
}

export default FMBPanelFooter
