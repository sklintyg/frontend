import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { logSrsInteraction } from '../../../store/srs/srsActions'
import type { SrsRecommendation } from '../../../types';
import { SrsEvent } from '../../../types'
import { ExpandableList } from '../../utils/ExpandableList'
import { ExpandableTextWithTitle } from '../../utils/ExpandableTextWithTitle'
import { EmptySrsRecommendations } from './EmptySrsRecommendations'

interface Props {
  recommendations: SrsRecommendation[]
  isEmpty: boolean
  diagnosisCode?: string
  diagnosisDescription?: string
  title: string
  id: string
}

const StyledListItem = styled.li`
  display: flex;
  align-items: baseline;
`

export const SrsRecommendationsBox = React.forwardRef<HTMLDivElement, Props>(
  ({ recommendations, isEmpty, diagnosisCode, diagnosisDescription, title, id }, ref) => {
    const dispatch = useDispatch()

    const logInteraction = (event: SrsEvent, shouldLog: boolean) => {
      if (shouldLog) {
        dispatch(logSrsInteraction(event))
      }
    }

    if (!recommendations || recommendations.length == 0 || isEmpty) {
      return <EmptySrsRecommendations diagnosisCode={diagnosisCode} title={title} />
    }

    return (
      <div ref={ref}>
        <h3 className="iu-fw-bold iu-mt-400">{title}</h3>
        {diagnosisCode && diagnosisDescription && (
          <p className="iu-fw-bold iu-mb-200">
            {diagnosisCode} - {diagnosisDescription}
          </p>
        )}
        <ul>
          <ExpandableList
            nbrOfVisibleItems={4}
            items={recommendations.map((recommendation, index) => {
              return (
                <StyledListItem key={`${id}${index}`}>
                  <ExpandableTextWithTitle
                    text={recommendation.recommendationText ? recommendation.recommendationText : 'Text saknas'}
                    title={recommendation.recommendationTitle ? recommendation.recommendationTitle : 'Titel saknas'}
                    onClick={(currentExpanded) => logInteraction(SrsEvent.SRS_MEASURES_EXPAND_ONE_CLICKED, currentExpanded)}
                  />
                </StyledListItem>
              )
            })}
            onClick={(currentExpanded) => logInteraction(SrsEvent.SRS_MEASURES_SHOW_MORE_CLICKED, currentExpanded)}
          />
        </ul>
      </div>
    )
  }
)
