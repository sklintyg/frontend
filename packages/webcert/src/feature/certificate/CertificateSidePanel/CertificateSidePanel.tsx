import React, { useState } from 'react'
import { getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import { useDispatch, useSelector } from 'react-redux'
import AboutCertificatePanel from './AboutCertificatePanel'
import FMBPanel from '../../../components/fmb/FMBPanel'
import { ButtonTooltip, Tabs } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faFileAlt, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { getUserPreference } from '../../../store/user/userSelectors'
import { setUserPreference } from '../../../store/user/userActions'
import { getResourceLink, ResourceLinkType } from '@frontend/common/src'
import { css } from 'styled-components'
import styled from 'styled-components/macro'
import QuestionPanel from '../../../components/question/QuestionPanel'

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
  const dispatch = useDispatch()
  const showSpinner = useSelector(getIsShowSpinner)
  const SIDEBAR_MINIMIZED = 'wc.sidebarMinimized'
  const minimized = useSelector(getUserPreference(SIDEBAR_MINIMIZED))
  const fmbTabIndex = 0
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const resourceLinks = useSelector(getResourceLinks)
  const fmbInfoPanelActive = getResourceLink(resourceLinks, ResourceLinkType.FMB)
  const questionsPanelActive = getResourceLink(resourceLinks, ResourceLinkType.QUESTIONS)
  const aboutCertificateTabIndex = fmbInfoPanelActive ? 1 : 0

  if (showSpinner) return null

  const handleTabChange = (value: number): void => {
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
    //TODO: Add button tooltip to chevronrighticon when , i removed it because of a css bug with the current tooltip
    return (
      <div css={pointerCursor} onClick={() => handleMinimizeSidePanelClick()}>
        {/* <ButtonTooltip description="Döljer högerfältet"> */}
        <FontAwesomeIcon icon={faChevronRight} />
        {/* </ButtonTooltip> */}
      </div>
    )
  }

  const getTabsArray = () => {
    const array = []

    if (fmbInfoPanelActive) {
      array.push(
        <ButtonTooltip description={fmbInfoPanelActive.description}>
          <p>
            <FontAwesomeIcon icon={faLightbulb} className="iu-mr-200" />
            {fmbInfoPanelActive.name}
          </p>
        </ButtonTooltip>
      )
    }

    if (questionsPanelActive) {
      array.push(
        <ButtonTooltip description={questionsPanelActive.description}>
          <p>
            <FontAwesomeIcon icon={faLightbulb} className="iu-mr-200" />
            {questionsPanelActive.name}
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

    if (questionsPanelActive) {
      array.push(<QuestionPanel tabIndex={fmbTabIndex} selectedTabIndex={selectedTabIndex} minimizeSidePanel={<MinimizeSidePanel />} />)
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
            selectedTabIndex={selectedTabIndex}
            setSelectedTabIndex={handleTabChange}
            tabs={getTabsArray()}
            tabsContent={getTabsContentArray()}></Tabs>
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
                  <FontAwesomeIcon icon={faLightbulb} size={'lg'} />

                  <p>FMB</p>
                </div>
              </ButtonTooltip>
            )}
            <ButtonTooltip description="Öppnar fliken med information om intyget.">
              <div
                css={pointerCursor}
                className="iu-pt-400 iu-flex iu-flex-center"
                onClick={() => handleRestoreSidePanelClick(aboutCertificateTabIndex)}>
                <FontAwesomeIcon icon={faFileAlt} />
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
