import { LightbulpIcon, ResourceLink, ResourceLinkType, Tabs } from '@frontend/common'
import _ from 'lodash'
import React, { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import FMBPanel from '../../../components/fmb/FMBPanel'
import { getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import AboutCertificatePanel from './AboutCertificatePanel'
import QuestionPanel from '../../../components/question/QuestionPanel'
import QuestionNotAvailablePanel from '../../../components/question/QuestionNotAvailablePanel'
import SRSPanel from '../../../components/srs/SRSPanel'

const CertificateSidePanel: React.FC = () => {
  const showSpinner = useSelector(getIsShowSpinner)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const resourceLinksForTabs = [
    ResourceLinkType.SRS,
    ResourceLinkType.FMB,
    ResourceLinkType.QUESTIONS,
    ResourceLinkType.QUESTIONS_NOT_AVAILABLE,
  ]

  if (showSpinner) return null

  const handleTabChange = (value: number): void => {
    setSelectedTabIndex(value)
  }

  const getTab = (name: string, description: string, icon?: ReactNode) => {
    return (
      <div data-tip={description}>
        <p>
          {icon && icon}
          {name}
        </p>
      </div>
    )
  }

  const getTabFromLink = (link: ResourceLink, icon?: ReactNode) => {
    return getTab(link.name, link.description, icon)
  }

  const getIcon = (type: ResourceLinkType) => {
    if (type === ResourceLinkType.FMB || type === ResourceLinkType.SRS) {
      return <LightbulpIcon className="iu-mr-200" />
    }
  }

  const getPanel = (type: ResourceLinkType) => {
    switch (type) {
      case ResourceLinkType.FMB:
        return <FMBPanel></FMBPanel>
      case ResourceLinkType.QUESTIONS:
        return <QuestionPanel />
      case ResourceLinkType.QUESTIONS_NOT_AVAILABLE:
        return <QuestionNotAvailablePanel />
      case ResourceLinkType.SRS:
        return <SRSPanel />
    }
  }

  const getTabs = () => {
    const tabsArray: ReactNode[] = []
    const tabsContentArray: ReactNode[] = []

    resourceLinksForTabs.forEach((type) => {
      const link = resourceLinks.find((l) => l.type === type)
      if (link) {
        tabsArray.push(getTabFromLink(link, getIcon(link.type)))
        tabsContentArray.push(getPanel(link.type))
      }
    })

    tabsArray.push(getTab('Om intyget', 'Läs om intyget'))
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
