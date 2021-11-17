import React, { ReactNode, useState } from 'react'
import { getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import { useSelector } from 'react-redux'
import AboutCertificatePanel from './AboutCertificatePanel'
import FMBPanel from '../../../components/fmb/FMBPanel'
import { CustomTooltip, Tabs, getResourceLink, ResourceLinkType } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components/macro'
import QuestionPanel from '../../../components/question/QuestionPanel'
import QuestionNotAvailablePanel from '../../../components/question/QuestionNotAvailablePanel'
import _ from 'lodash'

const Root = styled.div`
  overflow-y: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const CertificateSidePanel: React.FC = () => {
  const showSpinner = useSelector(getIsShowSpinner)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const fmbInfoPanelActive = getResourceLink(resourceLinks, ResourceLinkType.FMB)
  const questionsPanelActive = getResourceLink(resourceLinks, ResourceLinkType.QUESTIONS)
  const questionsNotAvailablePanelActive = getResourceLink(resourceLinks, ResourceLinkType.QUESTIONS_NOT_AVAILABLE)

  if (showSpinner) return null

  const handleTabChange = (value: number): void => {
    setSelectedTabIndex(value)
  }

  const getTabs = () => {
    const tabsArray: ReactNode[] = []
    const tabsContentArray: ReactNode[] = []

    if (questionsPanelActive) {
      tabsArray.push(
        <>
          <p data-tip={questionsPanelActive.description}>{questionsPanelActive.name}</p>
          <CustomTooltip />
        </>
      )

      tabsContentArray.push(<QuestionPanel />)
    }

    if (questionsNotAvailablePanelActive) {
      tabsArray.push(
        <>
          <p data-tip={questionsNotAvailablePanelActive.description}>{questionsNotAvailablePanelActive.name}</p>
          <CustomTooltip />
        </>
      )

      tabsContentArray.push(<QuestionNotAvailablePanel />)
    }

    if (fmbInfoPanelActive) {
      tabsArray.push(
        <>
          <p data-tip={fmbInfoPanelActive.description}>
            <FontAwesomeIcon icon={faLightbulb} className="iu-mr-200" />
            {fmbInfoPanelActive.name}
          </p>
          <CustomTooltip />
        </>
      )

      tabsContentArray.push(<FMBPanel />)
    }

    tabsArray.push(
      <>
        <p data-tip={'Läs om intyget.'}>Om intyget</p>
        <CustomTooltip />
      </>
    )

    tabsContentArray.push(<AboutCertificatePanel />)

    return {
      getTabsArray: () => tabsArray,
      getTabsContentArray: () => tabsContentArray,
    }
  }

  return (
    <Root className={'iu-border-secondary-light'}>
      <Tabs
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={handleTabChange}
        tabs={getTabs().getTabsArray()}
        tabsContent={getTabs().getTabsContentArray()}
      />
    </Root>
  )
}

export default CertificateSidePanel
