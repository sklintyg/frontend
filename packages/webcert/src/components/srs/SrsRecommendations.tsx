import React from 'react'
import { useSelector } from 'react-redux'
import { getDiagnosisCode, getDiagnosisDescription, getSickLeaveChoice, getSrsInfo } from '../../store/srs/srsSelectors'
import { InfoBox, SrsSickLeaveChoice, SrsRecommendation, ExpandableTextWithTitle } from '@frontend/common'
import styled from 'styled-components'

export const SRS_OBSERVE_TITLE = 'Tänk på att'
export const SRS_EXTENSION_TITLE = 'Tänk på att vid förlängning'
export const SRS_RECOMMENDATIONS_TITLE = 'Åtgärdsrekommendationer'

const StyledListItem = styled.li`
  display: flex;
  align-items: baseline;
`

const SrsRecommendations: React.FC = () => {
  const info = useSelector(getSrsInfo)
  const sickLeaveChoice = useSelector(getSickLeaveChoice)
  const diagnosisCode = useSelector(getDiagnosisCode)
  const diagnosisDescription = useSelector(getDiagnosisDescription)
  const isExtension = sickLeaveChoice === SrsSickLeaveChoice.EXTENSION || sickLeaveChoice === SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS

  if (!info) {
    return null
  }

  const EMPTY_TEXT = `För ${diagnosisCode} finns ingen SRS-information för detta fält.`

  const getInformationBox = (title: string, recommendations: SrsRecommendation[], key: string) => {
    if (recommendations.length == 0 || info.atgarderStatusCode === 'INFORMATION_SAKNAS') {
      return (
        <>
          <p className="iu-fw-bold">{title}</p>
          <InfoBox type="info">{EMPTY_TEXT}</InfoBox>
        </>
      )
    }

    return (
      <>
        <p className="iu-fw-bold iu-mt-400">{title}</p>
        <p className="iu-fw-bold iu-mb-200">
          {diagnosisCode} {diagnosisDescription}
        </p>
        <ul>
          {recommendations.map((recommendation, index) => {
            return (
              <StyledListItem key={`${key}${index}`}>
                <ExpandableTextWithTitle
                  text={recommendation.recommendationText ? recommendation.recommendationText : 'Text saknas'}
                  title={recommendation.recommendationTitle ? recommendation.recommendationTitle : 'Titel saknas'}
                />
              </StyledListItem>
            )
          })}
        </ul>
      </>
    )
  }

  return (
    <>
      {isExtension && getInformationBox(SRS_EXTENSION_TITLE, info.atgarderFrl, 'EXT-')}
      {getInformationBox(SRS_OBSERVE_TITLE, info.atgarderObs, 'OBS-')}
      {getInformationBox(SRS_RECOMMENDATIONS_TITLE, info.atgarderRek, 'REC-')}
    </>
  )
}

export default SrsRecommendations
