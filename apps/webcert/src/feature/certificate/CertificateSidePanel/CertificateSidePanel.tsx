import { isTruthy } from '@frontend/utils'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Tabs } from '../../../components/Tabs/Tabs'
import FMBPanel from '../../../components/fmb/FMBPanel'
import QuestionNotAvailablePanel from '../../../components/question/QuestionNotAvailablePanel'
import QuestionPanel from '../../../components/question/QuestionPanel'
import SrsPanel from '../../../components/srs/panel/SrsPanel'
import { getCertificate, getCertificateResourceLink, getIsShowSpinner } from '../../../store/certificate/certificateSelectors'
import { getIsLoadingQuestions, getQuestions } from '../../../store/question/questionSelectors'
import { logSrsInteraction } from '../../../store/srs/srsActions'
import { useAppSelector } from '../../../store/store'
import { ResourceLinkType, SrsEvent } from '../../../types'
import AboutCertificatePanel from './AboutCertificatePanel'

const CertificateSidePanel = () => {
  const showSpinner = useAppSelector(getIsShowSpinner)
  const isLoadingQuestions = useAppSelector(getIsLoadingQuestions)
  const hasUnhandledQuestions = useAppSelector((state) => getQuestions(state).filter((question) => !question.handled).length > 0)
  const hasCertificate = useAppSelector((state) => Boolean(getCertificate(state)))
  const availableTabs = [
    useAppSelector(getCertificateResourceLink(ResourceLinkType.SRS_FULL_VIEW)),
    useAppSelector(getCertificateResourceLink(ResourceLinkType.SRS_MINIMIZED_VIEW)),
    useAppSelector(getCertificateResourceLink(ResourceLinkType.FMB)),
    useAppSelector(getCertificateResourceLink(ResourceLinkType.QUESTIONS)),
    useAppSelector(getCertificateResourceLink(ResourceLinkType.QUESTIONS_NOT_AVAILABLE)),
  ].filter(isTruthy)

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [hasUpdatedTab, setHasUpdatedTab] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isSRSPanelActive, setIsSRSPanelActive] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (hasCertificate && !showSpinner && !isLoadingQuestions) {
      const questionsTab = availableTabs.findIndex((tab) => tab.type === ResourceLinkType.QUESTIONS)
      if (questionsTab !== -1 && hasUnhandledQuestions && !hasUpdatedTab) {
        setSelectedTabIndex(questionsTab)
        setHasUpdatedTab(true)
      }
      setHasLoaded(true)
    }
  }, [hasCertificate, showSpinner, hasUpdatedTab, isLoadingQuestions, availableTabs, hasUnhandledQuestions])

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
      tabs={[...availableTabs, { name: 'Om intyget', description: 'Läs om intyget' }]}
      tabsContent={[...availableTabs.map(({ type }) => getPanel(type)), <AboutCertificatePanel key={'about'} />]}
    />
  )
}

export default CertificateSidePanel
