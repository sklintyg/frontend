import { makeStyles, Paper, Typography, Link, Tooltip } from '@material-ui/core'
import React from 'react'
import LaunchIcon from '@material-ui/icons/Launch'
import sosLogo from './socialstyrelsen.png'
import { ButtonTooltip } from '@frontend/common'
import colors from '../../../components/styles/colors'

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
  link: {
    fontSize: theme.typography.pxToRem(14),
    color: 'inherit',
    textDecoration: 'underline',
  },
  icon: {
    fontSize: 'small',
    marginLeft: theme.spacing(0.5),
  },
}))

//TODO: Get link information from webcert.links.json

const FMBPanelFooter: React.FC = () => {
  const classes = useStyles()

  return (
    <Paper square className={classes.root}>
      <div className={classes.textWrapper}>
        <Link className={classes.link} target="_blank" href={'https://roi.socialstyrelsen.se/fmb'}>
          <ButtonTooltip description="Öppnar Socialstyrelsens beslutstöd för angiven huvuddiagnos">
            <Typography className={classes.link}>Läs mer om FMB hos Socialstyrelsen</Typography>
          </ButtonTooltip>
        </Link>
        <LaunchIcon className={classes.icon} />
        <div className={classes.logoWrapper}>
          <img alt="" src={sosLogo} />
        </div>
      </div>
    </Paper>
  )
}

export default FMBPanelFooter
