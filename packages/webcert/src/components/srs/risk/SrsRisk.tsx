import React, { useEffect, useState } from 'react'
import SrsRiskForm from './SrsRiskForm'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, SrsAnswer, SrsEvent, SrsSickLeaveChoice } from '@frontend/common'
import { useDispatch, useSelector } from 'react-redux'
import {
  getCertificateId,
  getPatientId,
  getPredictionDiagnosisCode,
  getSickLeaveChoice,
  getSrsPredictions,
} from '../../../store/srs/srsSelectors'
import SrsRiskGraph from './SrsRiskGraph'
import SrsRiskOpinion from './SrsRiskOpinion'
import { getPredictions, logSrsInteraction } from '../../../store/srs/srsActions'

const StyledButton = styled.button`
  font-size: 1.375em;
  font-family: inherit;
  width: calc(100% + 40px);
  padding: 1rem;
  margin: 20px 0 20px -40px;
  left: 20px;
  position: relative;
  border: none;
  color: inherit;
  font-weight: 700;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
  text-align: left;
`

const BottomBorder = styled.div`
  height: 20px;
  margin: 20px -20px;
`

export const SRS_RISK_BUTTON_TEXT = 'Beräkna risk här'

const SrsRisk: React.FC = () => {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)

  const patientId = useSelector(getPatientId)
  const certificateId = useSelector(getCertificateId)
  const diagnosisCode = useSelector(getPredictionDiagnosisCode)
  const sickLeaveChoice = useSelector(getSickLeaveChoice)
  const predictions = useSelector(getSrsPredictions)

  const previousAnswers = predictions.length > 0 ? predictions[0].questionsResponses : undefined
  const isCalculatingRiskDisabled = sickLeaveChoice === SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS

  const getIcon = () => {
    return expanded ? (
      <ChevronUpIcon size="sm" className="iu-ml-200" style={{ height: 'auto', marginBottom: '4px' }} data-testid="chevron-up" />
    ) : (
      <ChevronDownIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} data-testid="chevron-down" />
    )
  }

  useEffect(() => {
    if (isCalculatingRiskDisabled) {
      setExpanded(false)
    }
  }, [isCalculatingRiskDisabled])

  const onButtonClicked = () => {
    if (expanded) {
      dispatch(logSrsInteraction(SrsEvent.SRS_HIDE_QUESTIONS_CLICKED))
    } else {
      dispatch(logSrsInteraction(SrsEvent.SRS_SHOW_QUESTIONS_CLICKED))
    }

    setExpanded(!expanded)
  }

  const onCalculateRisk = (answers: SrsAnswer[]) => {
    dispatch(
      getPredictions({
        patientId: patientId,
        certificateId: certificateId,
        code: diagnosisCode,
        answers: answers,
      })
    )

    dispatch(logSrsInteraction(SrsEvent.SRS_CALCULATE_CLICKED))
    setExpanded(false)
  }

  return (
    <>
      <SrsRiskGraph />
      <SrsRiskOpinion />
      <StyledButton
        className={`${isCalculatingRiskDisabled ? 'iu-bg-grey-200' : 'iu-bg-information-light'}`}
        onClick={onButtonClicked}
        disabled={isCalculatingRiskDisabled}>
        {SRS_RISK_BUTTON_TEXT} {getIcon()}
      </StyledButton>
      {expanded && (
        <>
          <SrsRiskForm previousAnswers={previousAnswers ? previousAnswers : []} onClick={onCalculateRisk} />
          <BottomBorder className="iu-bg-information-light" />
        </>
      )}
    </>
  )
}

export default SrsRisk
