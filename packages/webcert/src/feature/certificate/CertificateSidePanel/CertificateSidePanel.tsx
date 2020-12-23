import React, { useState } from 'react'
// import { Paper, Tabs, Tab, Box, Typography } from '@material-ui/core'
import { getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AboutCertificatePanel from './AboutCertificatePanel'
import FMBPanel from './FMBPanel'
import { ButtonTooltip, Tabs } from '@frontend/common'
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined'
import DescriptionIcon from '@material-ui/icons/Description'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { getUserPreference } from '../../../store/user/userSelectors'
import { setUserPreference } from '../../../store/user/userActions'
import colors from '../../../components/styles/colors'
import { getResourceLink, ResourceLinkType } from '@frontend/common/src'
import { css } from 'styled-components'
import styled from 'styled-components/macro'

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

const StyledEmojiObjectsOutlinedIcon = styled(EmojiObjectsOutlinedIcon)`
  vertical-align: middle;
  margin-right: 4px;
`

const Root = styled.div`
  overflow-y: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MinimizedRoot = styled.div`
  overflow-y: auto;
  height: 100%;
  display: flex;
`

const MinimizedMenu = styled.div`
  margin-left: auto;
  padding: 16px;
`

const pointerCursor = css`
  cursor: pointer;
`

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
      <div css={pointerCursor} onClick={() => handleMinimizeSidePanelClick()}>
        <ButtonTooltip description="Döljer högerfältet">
          <ChevronRightIcon />
        </ButtonTooltip>
      </div>
    )
  }

  const getTabsArray = () => {
    const array = []

    if (fmbInfoPanelActive) {
      array.push(
        <ButtonTooltip description={fmbInfoPanelActive.description}>
          <p>
            <StyledEmojiObjectsOutlinedIcon />
            {fmbInfoPanelActive.name}
          </p>
        </ButtonTooltip>
      )
    }

    array.push(
      <ButtonTooltip description="Läs om intyget.">
        <p>Om intyget</p>
      </ButtonTooltip>
    )

    return array
  }

  const getTabsContentArray = () => {
    const array = []

    if (fmbInfoPanelActive) {
      array.push(<FMBPanel tabIndex={fmbTabIndex} selectedTabIndex={selectedTabIndex} minimizeSidePanel={<MinimizeSidePanel />} />)
    }

    array.push(
      <AboutCertificatePanel
        tabIndex={aboutCertificateTabIndex}
        selectedTabIndex={selectedTabIndex}
        minimizeSidePanel={<MinimizeSidePanel />}
      />
    )

    return array
  }

  return (
    <>
      {minimized !== 'true' ? (
        <Root>
          <Tabs
            tabs={[
              <ButtonTooltip description="Läs om intyget.">
                <p>Om intyget</p>
              </ButtonTooltip>,
            ]}
            tabsContent={getTabsContentArray()}></Tabs>
          {/* <Tabs
            className={`${classes.border} ${classes.tabs}`}
            TabIndicatorProps={{ style: { height: '0px' } }}
            value={selectedTabIndex}
            onChange={handleTabChange}>
            {fmbInfoPanelActive && (
              <Tab
                className={selectedTabIndex === fmbTabIndex ? 'iu-bg-grey-300' : ''}
                label={
                  <ButtonTooltip description={fmbInfoPanelActive.description}>
                    <p>
                      <StyledEmojiObjectsOutlinedIcon />
                      {fmbInfoPanelActive.name}
                    </p>
                  </ButtonTooltip>
                }
              />
            )}
            <Tab
              className={selectedTabIndex === aboutCertificateTabIndex ? classes.activeTab : ''}
              label={
                <ButtonTooltip description="Läs om intyget.">
                  <p>Om intyget</p>
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
          /> */}
        </Root>
      ) : (
        <MinimizedRoot>
          <MinimizedMenu className="iu-bg-grey-400">
            {fmbInfoPanelActive && (
              <ButtonTooltip description="Öppnar fliken med det försäkringsmedicinska beslutsstödet.">
                <div
                  css={pointerCursor}
                  className="iu-pt-400 iu-flex iu-flex-center"
                  onClick={() => handleRestoreSidePanelClick(fmbTabIndex)}>
                  <EmojiObjectsOutlinedIcon />
                  <p>FMB</p>
                </div>
              </ButtonTooltip>
            )}
            <ButtonTooltip description="Öppnar fliken med information om intyget.">
              <div
                css={pointerCursor}
                className="iu-pt-400 iu-flex iu-flex-center"
                onClick={() => handleRestoreSidePanelClick(aboutCertificateTabIndex)}>
                <DescriptionIcon />
                <p>Om intyget</p>
              </div>
            </ButtonTooltip>
          </MinimizedMenu>
        </MinimizedRoot>
      )}
    </>
  )
}

export default CertificateSidePanel
