import React, { useState } from 'react'
import { getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import { useSelector } from 'react-redux'
import AboutCertificatePanel from './AboutCertificatePanel'
import FMBPanel from '../../../components/fmb/FMBPanel'
import { ButtonTooltip, Tabs } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { getResourceLink, ResourceLinkType } from '@frontend/common/src'
import styled from 'styled-components/macro'
import QuestionPanel from '../../../components/question/QuestionPanel'
import QuestionNotAvailablePanel from '../../../components/question/QuestionNotAvailablePanel'

const Root = styled.div`
  overflow-y: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const CertificateSidePanel: React.FC = () => {
  const showSpinner = useSelector(getIsShowSpinner)
  const fmbTabIndex = 0
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const resourceLinks = useSelector(getResourceLinks)
  const fmbInfoPanelActive = getResourceLink(resourceLinks, ResourceLinkType.FMB)
  const questionsPanelActive = getResourceLink(resourceLinks, ResourceLinkType.QUESTIONS)
  const questionsNotAvailablePanelActive = getResourceLink(resourceLinks, ResourceLinkType.QUESTIONS_NOT_AVAILABLE)
  const aboutCertificateTabIndex = fmbInfoPanelActive ? 1 : 0

  if (showSpinner) return null

  const handleTabChange = (value: number): void => {
    setSelectedTabIndex(value)
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
          <p>{questionsPanelActive.name}</p>
        </ButtonTooltip>
      )
    }

    if (questionsNotAvailablePanelActive) {
      array.push(
        <ButtonTooltip description={questionsNotAvailablePanelActive.description}>
          <p>{questionsNotAvailablePanelActive.name}</p>
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
      array.push(<FMBPanel tabIndex={fmbTabIndex} selectedTabIndex={selectedTabIndex} />)
    }

    if (questionsPanelActive) {
      array.push(<QuestionPanel tabIndex={fmbTabIndex} selectedTabIndex={selectedTabIndex} />)
    }

    if (questionsNotAvailablePanelActive) {
      array.push(<QuestionNotAvailablePanel tabIndex={fmbTabIndex} selectedTabIndex={selectedTabIndex} />)
    }

    array.push(<AboutCertificatePanel tabIndex={aboutCertificateTabIndex} selectedTabIndex={selectedTabIndex} />)

    return array
  }

  return (
    <Root className={'iu-border-secondary-light'}>
      <Tabs
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={handleTabChange}
        tabs={getTabsArray()}
        tabsContent={getTabsContentArray()}
      />
    </Root>
  )
}

export default CertificateSidePanel
