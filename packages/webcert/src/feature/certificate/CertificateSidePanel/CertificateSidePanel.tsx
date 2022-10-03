import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getResourceLink, ResourceLinkType, Tabs } from '@frontend/common'
import _ from 'lodash'
import React, { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import FMBPanel from '../../../components/fmb/FMBPanel'
import QuestionNotAvailablePanel from '../../../components/question/QuestionNotAvailablePanel'
import QuestionPanel from '../../../components/question/QuestionPanel'
import { getCertificate, getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import AboutCertificatePanel from './AboutCertificatePanel'

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
  const [headerHeight, setHeaderHeight] = useState(0)
  const certificate = useSelector(getCertificate)

  if (showSpinner) return null

  const handleTabChange = (value: number): void => {
    setSelectedTabIndex(value)
  }

  const getTabs = () => {
    const tabsArray: ReactNode[] = []
    const tabsContentArray: ReactNode[] = []

    if (questionsPanelActive && certificate) {
      tabsArray.push(
        <div data-tip={questionsPanelActive.description}>
          <p>{questionsPanelActive.name}</p>
        </div>
      )

      tabsContentArray.push(<QuestionPanel headerHeight={headerHeight} certificateId={certificate.metadata.id} />)
    }

    if (questionsNotAvailablePanelActive) {
      tabsArray.push(
        <div data-tip={questionsNotAvailablePanelActive.description}>
          <p>{questionsNotAvailablePanelActive.name}</p>
        </div>
      )

      tabsContentArray.push(<QuestionNotAvailablePanel />)
    }

    if (fmbInfoPanelActive) {
      tabsArray.push(
        <div data-tip={fmbInfoPanelActive.description}>
          <p>
            <FontAwesomeIcon icon={faLightbulb} className="iu-mr-200" />
            {fmbInfoPanelActive.name}
          </p>
        </div>
      )

      tabsContentArray.push(<FMBPanel headerHeight={headerHeight} />)
    }

    tabsArray.push(
      <div data-tip="Läs om intyget.">
        <p>Om intyget</p>
      </div>
    )

    tabsContentArray.push(<AboutCertificatePanel headerHeight={headerHeight} />)

    return {
      getTabsArray: () => tabsArray,
      getTabsContentArray: () => tabsContentArray,
    }
  }

  return (
    <Root className="iu-border-secondary-light">
      <Tabs
        setHeaderHeight={(height: number) => {
          setHeaderHeight(height)
        }}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={handleTabChange}
        tabs={getTabs().getTabsArray()}
        tabsContent={getTabs().getTabsContentArray()}
      />
    </Root>
  )
}

export default CertificateSidePanel
