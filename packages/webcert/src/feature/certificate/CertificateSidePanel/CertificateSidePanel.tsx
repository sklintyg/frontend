import React from 'react'
import { Paper, Tabs, Tab } from '@material-ui/core'
import { getIsShowSpinner } from '../../../store/certificate/certificateSelectors'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import CertificateAbout from './CertificateAbout'
import SidePanelFooter from './SidePanelFooter'

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  border: {
    border: '1px solid #cdced6',
  },
  tabs: {
    borderBottom: 0,
  },
  tab: {
    paddingTop: theme.spacing(3),
  },
}))

const CertificateSidePanel: React.FC = () => {
  const showSpinner = useSelector(getIsShowSpinner)
  const classes = useStyles()

  if (showSpinner) return null

  return (
    <>
      <Paper className={classes.root} square elevation={0}>
        <Tabs className={`${classes.border} ${classes.tabs}`} value={0} indicatorColor="primary">
          <Tab className={classes.tab} label="Om intyget" />
        </Tabs>
        <CertificateAbout />
        <SidePanelFooter />
      </Paper>
    </>
  )
}

export default CertificateSidePanel
