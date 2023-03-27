import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDiagnosisCode, getDiagnosisDescription, getSickLeaveChoice, getSrsInfo } from '../../../store/srs/srsSelectors'
import {
  ExpandableList,
  ExpandableTextWithTitle,
  InfoBox,
  SrsInformationChoice,
  SrsRecommendation,
  SrsSickLeaveChoice,
  SrsEvent,
} from '@frontend/common'
import styled from 'styled-components'
import { logSrsInteraction } from '../../../store/srs/srsActions'

export const SRS_OBSERVE_TITLE = 'Tänk på att'
export const SRS_EXTENSION_TITLE = 'Tänk på att vid förlängning'
export const SRS_RECOMMENDATIONS_TITLE = 'Åtgärdsrekommendationer'

const StyledListItem = styled.li`
  display: flex;
  align-items: baseline;
`

const SrsRecommendations: React.FC = () => {
  const dispatch = useDispatch()
  const info = useSelector(getSrsInfo)
  const sickLeaveChoice = useSelector(getSickLeaveChoice)
  const diagnosisCode = useSelector(getDiagnosisCode(SrsInformationChoice.RECOMMENDATIONS))
  const diagnosisDescription = useSelector(getDiagnosisDescription(SrsInformationChoice.RECOMMENDATIONS))
  const isExtension = sickLeaveChoice === SrsSickLeaveChoice.EXTENSION || sickLeaveChoice === SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS

  if (!info) {
    return null
  }

  const EMPTY_TEXT = `För ${diagnosisCode ? diagnosisCode : 'vald diagnoskod'} finns ingen SRS-information för detta fält.`

  const getInformationBox = (title: string, recommendations: SrsRecommendation[], key: string, showDiagnosis: boolean) => {
    if (!recommendations || recommendations.length == 0 || info.atgarderStatusCode === 'INFORMATION_SAKNAS') {
      return (
        <>
          <h3 className="iu-fw-bold iu-mb-200">{title}</h3>
          <InfoBox type="info">{EMPTY_TEXT}</InfoBox>
        </>
      )
    }

    return (
      <>
        <h3 className="iu-fw-bold iu-mt-400">{title}</h3>
        <p className="iu-fw-bold iu-mb-200">{showDiagnosis && `${diagnosisCode} - ${diagnosisDescription}`}</p>
        <ul>
          <ExpandableList
            nbrOfVisibleItems={4}
            items={getInformationList(recommendations, key)}
            onClick={(currentExpanded: boolean) => logInteraction(SrsEvent.SRS_MEASURES_SHOW_MORE_CLICKED, currentExpanded)}
          />
        </ul>
      </>
    )
  }

  const logInteraction = (event: SrsEvent, shouldLog: boolean) => {
    if (shouldLog) {
      dispatch(logSrsInteraction(event))
    }
  }

  const getInformationList = (recommendations: SrsRecommendation[], key: string) => {
    return recommendations.map((recommendation, index) => {
      return (
        <StyledListItem key={`${key}${index}`}>
          <ExpandableTextWithTitle
            text={recommendation.recommendationText ? recommendation.recommendationText : 'Text saknas'}
            title={recommendation.recommendationTitle ? recommendation.recommendationTitle : 'Titel saknas'}
            onClick={(currentExpanded: boolean) => logInteraction(SrsEvent.SRS_MEASURES_EXPAND_ONE_CLICKED, currentExpanded)}
          />
        </StyledListItem>
      )
    })
  }

  return (
    <>
      {isExtension && getInformationBox(SRS_EXTENSION_TITLE, info.atgarderFrl, 'EXT-', false)}
      {getInformationBox(SRS_OBSERVE_TITLE, info.atgarderObs, 'OBS-', true)}
      {getInformationBox(SRS_RECOMMENDATIONS_TITLE, info.atgarderRek, 'REC-', true)}
    </>
  )
}

export default SrsRecommendations
