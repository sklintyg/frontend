import React, { useState } from 'react'
import { Paper, Tabs, Tab, Box, Typography } from '@material-ui/core'
import { getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AboutCertificatePanel from './AboutCertificatePanel'
import FMBPanel from './FMBPanel'
import { ButtonTooltip } from '@frontend/common'
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined'
import DescriptionIcon from '@material-ui/icons/Description'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { getUserPreference } from '../../../store/user/userSelectors'
import { setUserPreference } from '../../../store/user/userActions'
import colors from '../../../components/styles/colors'
import { getResourceLink, ResourceLinkType } from '@frontend/common/src'

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  border: {
    border: `1px solid colors.IA_COLOR_08`,
  },
  tabs: {
    borderBottom: 0,
  },
  activeTab: {
    backgroundColor: colors.IA_COLOR_08,
  },
  icon: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(0.5),
  },
  minimizedRoot: {
    overflowY: 'auto',
    height: '100%',
    display: 'flex',
  },
  minimizedMenu: {
    marginLeft: 'auto',
    backgroundColor: colors.IA_COLOR_08,
    padding: theme.spacing(2),
  },
  minimizedMenuItem: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  linkText: {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: theme.typography.subtitle2.fontWeight,
  },
  pointerCursor: {
    cursor: 'pointer',
  },
}))

const CertificateSidePanel: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const showSpinner = useSelector(getIsShowSpinner)
  const SIDEBAR_MINIMIZED = 'wc.sidebarMinimized'
  const minimized = useSelector(getUserPreference(SIDEBAR_MINIMIZED))
  const fmbTabIndex = 0
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const resourceLinks = useSelector(getResourceLinks)
  const fmbInfoPanelActive = getResourceLink(resourceLinks, ResourceLinkType.FMB)
  const aboutCertificateTabIndex = fmbInfoPanelActive ? 1 : 0

  if (showSpinner) return null

  const handleTabChange = (event: React.ChangeEvent<{}>, value: number): void => {
    setSelectedTabIndex(value)
  }

  const handleRestoreSidePanelClick = (value: number) => {
    dispatch(setUserPreference({ key: SIDEBAR_MINIMIZED, value: 'false' }))
    setSelectedTabIndex(value)
  }

  const handleMinimizeSidePanelClick = () => {
    dispatch(setUserPreference({ key: SIDEBAR_MINIMIZED, value: 'true' }))
  }

  const MinimizeSidePanel = () => {
    return (
      <Box className={classes.pointerCursor} onClick={() => handleMinimizeSidePanelClick()}>
        <ButtonTooltip description="Döljer högerfältet">
          <ChevronRightIcon />
        </ButtonTooltip>
      </Box>
    )
  }

  return (
    <>
      {minimized !== 'true' ? (
        <Paper className={classes.root} square elevation={0}>
          <Tabs
            className={`${classes.border} ${classes.tabs}`}
            TabIndicatorProps={{ style: { height: '0px' } }}
            value={selectedTabIndex}
            onChange={handleTabChange}>
            {fmbInfoPanelActive && (
              <Tab
                className={selectedTabIndex === fmbTabIndex ? classes.activeTab : ''}
                label={
                  <ButtonTooltip description={fmbInfoPanelActive.description}>
                    <Typography className={classes.linkText}>
                      <EmojiObjectsOutlinedIcon className={classes.icon} />
                      {fmbInfoPanelActive.name}
                    </Typography>
                  </ButtonTooltip>
                }
              />
            )}
            <Tab
              className={selectedTabIndex === aboutCertificateTabIndex ? classes.activeTab : ''}
              label={
                <ButtonTooltip description="Läs om intyget.">
                  <Typography className={classes.linkText}>Om intyget</Typography>
                </ButtonTooltip>
              }
            />
          </Tabs>
          {fmbInfoPanelActive && (
            <FMBPanel tabIndex={fmbTabIndex} selectedTabIndex={selectedTabIndex} minimizeSidePanel={<MinimizeSidePanel />} />
          )}
          <AboutCertificatePanel
            tabIndex={aboutCertificateTabIndex}
            selectedTabIndex={selectedTabIndex}
            minimizeSidePanel={<MinimizeSidePanel />}
          />
        </Paper>
      ) : (
        <Paper className={classes.minimizedRoot} square elevation={0}>
          <Box className={classes.minimizedMenu}>
            {fmbInfoPanelActive && (
              <ButtonTooltip description="Öppnar fliken med det försäkringsmedicinska beslutsstödet.">
                <Box
                  className={`${classes.minimizedMenuItem} ${classes.pointerCursor}`}
                  onClick={() => handleRestoreSidePanelClick(fmbTabIndex)}>
                  <EmojiObjectsOutlinedIcon />
                  <Typography className={classes.linkText}>FMB</Typography>
                </Box>
              </ButtonTooltip>
            )}
            <ButtonTooltip description="Öppnar fliken med information om intyget.">
              <Box
                className={`${classes.minimizedMenuItem} ${classes.pointerCursor}`}
                onClick={() => handleRestoreSidePanelClick(aboutCertificateTabIndex)}>
                <DescriptionIcon />
                <Typography className={classes.linkText}>Om intyget</Typography>
              </Box>
            </ButtonTooltip>
          </Box>
        </Paper>
      )}
    </>
  )
}

export default CertificateSidePanel
