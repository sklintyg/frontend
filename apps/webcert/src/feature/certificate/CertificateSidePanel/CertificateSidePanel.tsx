import { LightbulpIcon, ResourceLink, ResourceLinkType, SrsEvent, Tabs } from '@frontend/common'
import _ from 'lodash'
import React, { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FMBPanel from '../../../components/fmb/FMBPanel'
import { getCertificate, getIsShowSpinner, getResourceLinks } from '../../../store/certificate/certificateSelectors'
import AboutCertificatePanel from './AboutCertificatePanel'
import QuestionPanel from '../../../components/question/QuestionPanel'
import QuestionNotAvailablePanel from '../../../components/question/QuestionNotAvailablePanel'
import SrsPanel from '../../../components/srs/panel/SrsPanel'
import { getIsLoadingQuestions, getQuestions } from '../../../store/question/questionSelectors'
import { logSrsInteraction } from '../../../store/srs/srsActions'

const CertificateSidePanel: React.FC = () => {
  const showSpinner = useSelector(getIsShowSpinner)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const questions = useSelector(getQuestions, _.isEqual)
  const isLoadingQuestions = useSelector(getIsLoadingQuestions)
  const certificate = useSelector(getCertificate, _.isEqual)
  const resourceLinksForTabs = [
    ResourceLinkType.SRS_FULL_VIEW,
    ResourceLinkType.SRS_MINIMIZED_VIEW,
    ResourceLinkType.FMB,
    ResourceLinkType.QUESTIONS,
    ResourceLinkType.QUESTIONS_NOT_AVAILABLE,
  ]

  const availableTabs = resourceLinksForTabs.reduce<ResourceLink[]>((result, type) => {
    const link = resourceLinks.find((link) => type === link.type)
    return link ? [...result, link] : result
  }, [])

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [hasUpdatedTab, setHasUpdatedTab] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isSRSPanelActive, setIsSRSPanelActive] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (certificate && !showSpinner && !isLoadingQuestions) {
      const questionsTab = availableTabs.findIndex((tab) => tab.type === ResourceLinkType.QUESTIONS)
      const unhandledQuestions = questions.filter((question) => !question.handled)
      if (questionsTab !== -1 && unhandledQuestions.length > 0 && !hasUpdatedTab) {
        setSelectedTabIndex(questionsTab)
        setHasUpdatedTab(true)
      }
      setHasLoaded(true)
    }
  }, [certificate, showSpinner, questions, hasUpdatedTab, isLoadingQuestions, availableTabs])

  useEffect(() => {
    if (hasLoaded) {
      setIsSRSPanelActive(selectedTabIndex === 0)
    }
  }, [hasLoaded, selectedTabIndex])

  if (showSpinner) return null

  const handleTabChange = (value: number): void => {
    setSelectedTabIndex(value)
    if (
      availableTabs[value] &&
      (availableTabs[value].type === ResourceLinkType.SRS_FULL_VIEW || availableTabs[value].type === ResourceLinkType.SRS_MINIMIZED_VIEW)
    ) {
      setIsSRSPanelActive(true)
      dispatch(logSrsInteraction(SrsEvent.SRS_PANEL_ACTIVATED))
    }
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

  const getIcon = (type: ResourceLinkType) => {
    if (type === ResourceLinkType.FMB || type === ResourceLinkType.SRS_FULL_VIEW || type === ResourceLinkType.SRS_MINIMIZED_VIEW) {
      return <LightbulpIcon className="iu-mr-200" />
    }
  }

  const getPanel = (type: ResourceLinkType) => {
    switch (type) {
      case ResourceLinkType.FMB:
        return <FMBPanel />
      case ResourceLinkType.QUESTIONS:
        return <QuestionPanel />
      case ResourceLinkType.QUESTIONS_NOT_AVAILABLE:
        return <QuestionNotAvailablePanel />
      case ResourceLinkType.SRS_FULL_VIEW:
        return <SrsPanel isPanelActive={isSRSPanelActive} />
      case ResourceLinkType.SRS_MINIMIZED_VIEW:
        return <SrsPanel minimizedView isPanelActive={isSRSPanelActive} />
    }
  }

  return (
    <Tabs
      selectedTabIndex={selectedTabIndex}
      setSelectedTabIndex={handleTabChange}
      tabs={[
        ...availableTabs.map(({ type, name, description }) => getTab(name, description, getIcon(type))),
        getTab('Om intyget', 'Läs om intyget'),
      ]}
      tabsContent={[...availableTabs.map(({ type }) => getPanel(type)), <AboutCertificatePanel key={'about'} />]}
    />
  )
}

export default CertificateSidePanel
