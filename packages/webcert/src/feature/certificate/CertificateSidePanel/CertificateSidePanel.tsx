import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getResourceLink, ResourceLinkType, Tabs } from '@frontend/common'
import _ from 'lodash'
import React, { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import FMBPanel from '../../../components/fmb/FMBPanel'
import QuestionNotAvailablePanel from '../../../components/question/QuestionNotAvailablePanel'
import QuestionPanel from '../../../components/question/QuestionPanel'
import { getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import AboutCertificatePanel from './AboutCertificatePanel'

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
        <div data-tip={questionsPanelActive.description}>
          <p>{questionsPanelActive.name}</p>
        </div>
      )

      tabsContentArray.push(<QuestionPanel />)
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

      tabsContentArray.push(<FMBPanel />)
    }

    tabsArray.push(
      <div data-tip={'Läs om intyget.'}>
        <p>Om intyget</p>
      </div>
    )

    tabsContentArray.push(<AboutCertificatePanel />)

    return {
      getTabsArray: () => tabsArray,
      getTabsContentArray: () => tabsContentArray,
    }
  }

  return (
    <Tabs
      selectedTabIndex={selectedTabIndex}
      setSelectedTabIndex={handleTabChange}
      tabs={getTabs().getTabsArray()}
      tabsContent={getTabs().getTabsContentArray()}
    />
  )
}

export default CertificateSidePanel
